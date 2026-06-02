# Resume Autofill Application

A smart web application that automatically extracts and populates form fields from resume documents in multiple formats. Upload your resume once and let the application intelligently parse and fill in your information.

## 🎯 Features

- **Multi-Format Support**: Parse resumes in PDF, DOC, DOCX, and ODT formats
- **Intelligent Data Extraction**: Automatically identifies and extracts key resume information
- **Editable Form Fields**: Review and edit extracted data before submission
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Real-time Processing**: Fast document processing with instant results

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime for server-side execution
- **Express.js** - Web framework for building REST APIs
- **Multer** - Middleware for handling file uploads

### Frontend
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vanilla JavaScript** - Client-side interactivity

### Document Parsing Libraries
- **pdf-parse** - Extracts text from PDF files
- **mammoth** - Converts Word documents (.doc, .docx) to plain text
- **xml2js** - Parses XML content from ODT files
- **jszip** - Handles ZIP archives (ODT files are ZIP-based)
- **CORS** - Enables cross-origin requests

## 📋 Data Extraction & Parsing Strategy

### Personal Information
- **Name**: Extracted from the first 10 lines of the document, looking for 2-4 word lines containing only letters (avoids email, phone, keywords)
- **Email**: Regex pattern matching standard email format: `[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+`
- **Phone**: Regex pattern for international formats (10+ digits): `+1 (123) 456-7890`, `123-456-7890`, `+91 9742258337`
- **Location**: Matches city/country patterns like "Dubai, UAE" using regex: `City, CountryCode`

### Professional Summary
- **Extraction**: Looks for "PROFESSIONAL SUMMARY" section header
- **Boundary**: Captures text until "TECHNICAL SKILLS", "WORK EXPERIENCE", or end of document
- **Limit**: Truncates to 1000 characters to ensure completeness

### Work Experience
- **Parsing**: Splits by company name patterns followed by pipe separator (|) and job title
- **Example Format**: `Dell Technologies | Full Stack Developer`
- **Filtering**: Only extracts entries with 50+ characters and containing the pipe separator
- **Boundaries**: Captures until "EDUCATION", "TECHNICAL SKILLS", or "CERTIFICATIONS" sections

### Education
- **Parsing**: Splits by capital letter line breaks within the education section
- **Minimum Length**: Filters entries with 20+ characters
- **Boundaries**: Extracts from "EDUCATION" section until "EXPERIENCE", "SKILLS", or end

### Technical Skills
- **Parsing**: Splits by multiple delimiters: commas, newlines, bullets (•), hyphens, asterisks, colons, pipes
- **Filtering**: Removes duplicates and entries shorter than 2 characters
- **Boundaries**: Extracts from "TECHNICAL SKILLS" or "SKILLS" section until next major section

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ariya-shreshta/resume-autofill-app.git
   cd resume-autofill-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The application will be running and ready to use

## 📖 How to Use

1. **Upload Resume**: Drag and drop or click to select your resume file (PDF, DOC, DOCX, ODT)
2. **Wait for Processing**: The application will extract data from your resume
3. **Review Data**: Check the auto-filled form fields
4. **Edit if Needed**: Modify any extracted information as required
5. **Submit**: Click "Submit Form" to finalize

## 📁 Project Structure

```
resume-autofill-app/
├── public/
│   ├── index.html          # Main HTML page
│   └── script.js           # Client-side JavaScript
├── uploads/                # Temporary resume storage
├── server.js               # Express server & parsing logic
├── package.json            # Project dependencies
└── README.md               # This file
```

## 🔧 API Endpoints

### POST `/api/upload`
Uploads and processes a resume file.

**Request:**
- Content-Type: `multipart/form-data`
- File field: `resume`
- Accepted formats: `.pdf`, `.doc`, `.docx`, `.odt`

**Response:**
```json
{
  "success": true,
  "data": {
    "firstName": "Ariya",
    "lastName": "U V",
    "email": "ariya.shreshta105@gmail.com",
    "phone": "+91 9742258337, +971 54 3618358",
    "location": "Dubai, UAE",
    "summary": "Senior Full Stack Engineer with 9 years of experience...",
    "experience": ["Dell Technologies | Full Stack Developer..."],
    "education": ["B.E. Electronics & Instrumentation Engineering..."],
    "skills": ["React", "Node.js", "Python", "Kubernetes", ...]
  }
}
```

## 🌐 Deployment

### Deploy to Heroku

1. **Create Heroku account** at https://www.heroku.com

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open app**
   ```bash
   heroku open
   ```

## 📝 Supported Resume Formats

| Format | Extension | Parser | Status |
|--------|-----------|--------|--------|
| PDF | .pdf | pdf-parse | ✅ Supported |
| Word (Modern) | .docx | mammoth | ✅ Supported |
| Word (Legacy) | .doc | mammoth | ✅ Supported |
| OpenDocument | .odt | xml2js + jszip | ✅ Supported |

## ⚠️ Limitations

- Maximum file size: 10MB (configurable in multer settings)
- Resume parsing accuracy depends on document structure and formatting
- Highly customized resume formats may not parse perfectly
- Temporary files are deleted after processing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ariya U V**
- GitHub: [@ariya-shreshta](https://github.com/ariya-shreshta)
- Email: ariya.shreshta105@gmail.com

## 🙏 Acknowledgments

- Built with Node.js and Express.js
- Styled with Tailwind CSS
- Icons from Font Awesome
- Document parsing libraries: pdf-parse, mammoth, xml2js, jszip
