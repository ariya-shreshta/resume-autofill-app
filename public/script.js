let selectedFile = null;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const formSection = document.getElementById('formSection');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const clearBtn = document.getElementById('clearBtn');
const submitBtn = document.getElementById('submitBtn');

// File selection
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    uploadBtn.disabled = false;
    dropZone.style.borderColor = '#3b82f6';
    dropZone.style.backgroundColor = '#eff6ff';
  }
});

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#1d4ed8';
  dropZone.style.backgroundColor = '#dbeafe';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = '#93c5fd';
  dropZone.style.backgroundColor = 'white';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  selectedFile = e.dataTransfer.files[0];
  if (selectedFile) {
    fileInput.files = e.dataTransfer.files;
    uploadBtn.disabled = false;
    dropZone.style.borderColor = '#3b82f6';
    dropZone.style.backgroundColor = '#eff6ff';
  }
});

// Upload handler
uploadBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('resume', selectedFile);

  try {
    loadingSpinner.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    formSection.classList.add('hidden');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Upload failed');
    }

    populateForm(result.data);
    loadingSpinner.classList.add('hidden');
    formSection.classList.remove('hidden');

  } catch (error) {
    console.error('Error:', error);
    errorText.textContent = error.message || 'An error occurred while processing your resume.';
    errorMessage.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');
  }
});

function populateForm(data) {
  document.getElementById('firstName').value = data.firstName || '';
  document.getElementById('lastName').value = data.lastName || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('location').value = data.location || '';
  document.getElementById('summary').value = data.summary || '';

  // Experience - improved display with better formatting
  const experienceContainer = document.getElementById('experienceContainer');
  experienceContainer.innerHTML = '';
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach((exp, index) => {
      const div = document.createElement('div');
      div.className = 'bg-gray-50 p-4 rounded-lg border border-gray-200';
      div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-semibold text-gray-500">Experience ${index + 1}</span>
          <button class="text-red-500 hover:text-red-700 text-xs" onclick="this.parentElement.parentElement.remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <textarea class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="4" placeholder="Job title, company, dates, and responsibilities">${exp}</textarea>
      `;
      experienceContainer.appendChild(div);
    });
  }

  // Education - improved display
  const educationContainer = document.getElementById('educationContainer');
  educationContainer.innerHTML = '';
  if (data.education && data.education.length > 0) {
    data.education.forEach((edu, index) => {
      const div = document.createElement('div');
      div.className = 'bg-gray-50 p-4 rounded-lg border border-gray-200';
      div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-semibold text-gray-500">Education ${index + 1}</span>
          <button class="text-red-500 hover:text-red-700 text-xs" onclick="this.parentElement.parentElement.remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <textarea class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="3" placeholder="Degree, institution, dates">${edu}</textarea>
      `;
      educationContainer.appendChild(div);
    });
  }

  // Skills - improved display
  const skillsContainer = document.getElementById('skillsContainer');
  skillsContainer.innerHTML = '';
  if (data.skills && data.skills.length > 0) {
    data.skills.forEach(skill => {
      const span = document.createElement('span');
      span.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
      span.innerHTML = `${skill} <button class="ml-1 text-blue-600 hover:text-blue-800" onclick="this.parentElement.remove()">×</button>`;
      skillsContainer.appendChild(span);
    });
  }
}

// Clear handler
clearBtn.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  uploadBtn.disabled = true;
  formSection.classList.add('hidden');
  errorMessage.classList.add('hidden');
  dropZone.style.borderColor = '#93c5fd';
  dropZone.style.backgroundColor = 'white';
});

// Submit handler
submitBtn.addEventListener('click', () => {
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    location: document.getElementById('location').value,
    summary: document.getElementById('summary').value
  };

  console.log('Form submitted with data:', formData);
  alert('Form submitted successfully! (Check console for data)');
});
