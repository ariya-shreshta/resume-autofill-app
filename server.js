import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text'
    ];
    const allowedExts = ['.pdf', '.doc', '.docx', '.odt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed: PDF, DOC, DOCX, ODT'));
    }
  }
});

async function extractTextFromPDF(filePath) {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw error;
  }
}

async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw error;
  }
}

async function extractTextFromDOC(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOC parsing error:', error);
    throw error;
  }
}

async function extractTextFromODT(filePath) {
  try {
    const JSZip = (await import('jszip')).default;
    const buffer = fs.readFileSync(filePath);
    const zip = new JSZip();
    const zipData = await zip.loadAsync(buffer);
    const contentXml = await zipData.file('content.xml').async('string');
    
    const { parseStringPromise } = await import('xml2js');
    const parsed = await parseStringPromise(contentXml);
    
    let text = '';
    const extractText = (obj) => {
      if (typeof obj === 'string') {
        text += obj + ' ';
      } else if (Array.isArray(obj)) {
        obj.forEach(extractText);
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(extractText);
      }
    };
    
    extractText(parsed);
    return text;
  } catch (error) {
    console.error('ODT parsing error:', error);
    throw error;
  }
}

function parseResumeData(text) {
  const data = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: []
  };

  // Extract email
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    data.email = emailMatch[0];
  }

  // Extract ALL phone numbers (improved regex - must have at least 10 digits)
  const phoneRegex = /\+\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}|\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{4}/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches && phoneMatches.length > 0) {
    // Filter out year-like patterns and join all phone numbers with comma
    const validPhones = phoneMatches.filter(p => {
      const digits = p.replace(/\D/g, '');
      return digits.length >= 10 && !p.match(/^\d{4}$/); // Must have 10+ digits, not just 4
    });
    if (validPhones.length > 0) {
      data.phone = validPhones.map(p => p.trim()).join(', ');
    }
  }

  // Extract name (improved - look for name before contact info or at top)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Try to find name before email/phone (common resume format)
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    // Skip if line contains email, phone, or common resume keywords
    if (!line.match(/@|phone|email|address|experience|education|skills/i) && 
        line.split(/\s+/).length >= 2 && 
        line.split(/\s+/).length <= 4 &&
        /^[A-Za-z\s]+$/.test(line)) {
      const nameParts = line.split(/\s+/);
      if (nameParts.length >= 2) {
        data.firstName = nameParts[0];
        data.lastName = nameParts.slice(1).join(' ');
        break;
      }
    }
  }

  // Extract location (city, state, country) - look for pattern like "Dubai, UAE"
  const locationRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*,\s*([A-Z]{2,})\b/;
  const locationMatch = text.match(locationRegex);
  if (locationMatch) {
    data.location = locationMatch[0].trim();
  }

  // Extract professional summary (more complete)
  const summarySection = text.match(/(?:professional\s+)?summary([\s\S]*?)(?=technical\s+skills|work\s+experience|education|skills|$)/i);
  if (summarySection) {
    let summary = summarySection[1].trim();
    // Remove section headers and clean up
    summary = summary.replace(/^[:\s]+/, '').trim();
    // Take up to 1000 chars to get complete summary
    data.summary = summary.substring(0, 1000).trim();
  }

  // Extract experience (improved - split by job titles with dates)
  const experienceSection = text.match(/(?:work\s+)?experience([\s\S]*?)(?=education|technical\s+skills|skills|certifications|$)/i);
  if (experienceSection) {
    const expText = experienceSection[1];
    // Split by company name patterns followed by pipe and job title (e.g., "Dell Technologies | Full Stack Developer")
    const jobEntries = expText.split(/\n(?=[A-Z][a-zA-Z\s&.]+\s*\|)/);
    data.experience = jobEntries
      .map(job => job.trim())
      .filter(job => job.length > 50 && !job.match(/^(experience|work\s+history|technical\s+skills)/i) && job.includes('|'));
  }

  // Extract education
  const educationSection = text.match(/(?:education|academic|qualification)([\s\S]*?)(?=experience|skills|projects|certifications|$)/i);
  if (educationSection) {
    const eduText = educationSection[1];
    const schoolEntries = eduText.split(/\n(?=[A-Z])/);
    data.education = schoolEntries
      .map(school => school.trim())
      .filter(school => school.length > 20);
  }

  // Extract skills (improved - handles multiple formats)
  const skillsSection = text.match(/(?:technical\s+)?skills([\s\S]*?)(?=work\s+experience|experience|education|projects|certifications|languages|$)/i);
  if (skillsSection) {
    const skillsText = skillsSection[1];
    // Split by various delimiters and clean up
    const skillsList = skillsText
      .split(/[,\n•\-\*:|]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 2 && !skill.match(/^(skills|technical|expertise|competencies)/i));
    data.skills = [...new Set(skillsList)]; // Remove duplicates
  }

  return data;
}

app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let text = '';

    if (fileExt === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (fileExt === '.docx') {
      text = await extractTextFromDOCX(filePath);
    } else if (fileExt === '.doc') {
      text = await extractTextFromDOC(filePath);
    } else if (fileExt === '.odt') {
      text = await extractTextFromODT(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const resumeData = parseResumeData(text);

    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.json({
      success: true,
      data: resumeData
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Error processing file',
      message: error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
