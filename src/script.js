// Add event listener to the form for submitting PDF files
document.getElementById('pdfUploadForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission
  const fileInput = document.getElementById('pdfFile');
  const file = fileInput.files[0]; // Get the selected file

  if (file) {
    uploadPDF(file); // Upload the selected PDF file
  } else {
    alert('Please select a PDF file.'); // Notify user if no file is selected
  }
});

// Function to upload PDF file to the server
function uploadPDF(file) {
  const formData = new FormData();
  formData.append('pdfFile', file); // Append file to form data

  // Send POST request to upload endpoint
  fetch('/upload', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (response.ok) {
          Swal.fire('PDF uploaded successfully.'); // Notify user on successful upload
          displayUploadedPDF(file); // Display uploaded PDF after upload
          fetchPdfDetails(file.name); // Fetch PDF details after upload
      } else {
          throw new Error('Failed to upload PDF.'); // Throw error if upload fails
      }
  })
  .catch(error => {
      console.error('Upload error:', error); // Log upload error
      alert('');
      Swal.fire('Failed to upload PDF.'); // Notify user of upload failure
  });
}

// Function to display uploaded PDF
function displayUploadedPDF(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
      const pdfViewer = document.getElementById('pdfViewer');
      pdfViewer.src = event.target.result; // Set source of PDF viewer
      pdfViewer.style.display = 'block'; // Show PDF viewer
  };
  reader.readAsDataURL(file); // Read file as data URL
}

// Function to fetch PDF details from server
function fetchPdfDetails(fileName) {
  fetch(`/pdf-details/${fileName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch PDF details.'); // Throw error if fetching details fails
      }
      return response.json();
    })
    .then(data => {
      const totalPages = data.totalPages;
      displayCheckboxes(totalPages); // Display checkboxes for page selection
    })
    .catch(error => {
      console.error('PDF details fetch error:', error); // Log fetch error
      alert('Failed to fetch PDF details.'); // Notify user of fetch failure
    });
}

// Function to display checkboxes for page selection
function displayCheckboxes(totalPages) {
  const pageContainer = document.getElementById('pageContainer');
  pageContainer.innerHTML = ''; // Clear any existing content

  // Loop through total pages and create checkboxes
  for (let i = 1; i <= totalPages; i++) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'page' + i;
    checkbox.value = i;
    const label = document.createElement('label');
    label.htmlFor = 'page' + i;
    label.appendChild(document.createTextNode('Page ' + i));
    pageContainer.appendChild(checkbox);
    pageContainer.appendChild(label);
  }

  // Show extract button
  document.getElementById('extractPagesBtn').style.display = 'block';
  pageContainer.style.display = 'block';
}

// Add event listener to the extract button
document.getElementById('extractPagesBtn').addEventListener('click', function() {
  const checkboxes = document.querySelectorAll('#pageContainer input[type="checkbox"]:checked');
  const selectedPages = Array.from(checkboxes).map(checkbox => checkbox.value); // Get the values of checked checkboxes

  if (selectedPages.length > 0) {
    const fileName = document.getElementById('pdfFile').files[0].name; // Get the original filename

    // Send POST request to extract endpoint
    fetch('/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selectedPages: selectedPages.join(','), fileName: fileName }) // Pass the filename and selected pages to the server
    })
    .then(response => {
      if (response.ok) {
        return response.blob(); // Return blob if extraction is successful
      } else {
        throw new Error('Failed to extract PDF.'); // Throw error if extraction fails
      }
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'PDF Extracted successfully',
        text: 'The PDF file has been successfully Extracted.'
      });
      a.download = fileName; // Set the downloaded filename to the original filename
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
    .catch(error => {
      console.error('Extraction error:', error); // Log extraction error
      alert('Failed to extract PDF.'); // Notify user of extraction failure
    });
  } else {
    alert('Please select at least one page.'); // Notify user if no page is selected
  }
});
