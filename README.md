PDF Extraction Project
This project allows users to upload PDF files, select specific pages from the uploaded PDF, and extract those pages to create a new PDF for download.

Table of Contents

Features
PDF Upload: Users can upload PDF files from their device.
Page Selection: After uploading, users can select specific pages from the PDF using checkboxes.
PDF Extraction: Users can extract selected pages to create a new PDF.
Download: The newly extracted PDF can be downloaded by the user.

Technologies Used
Express.js: Used to build the backend server.
Multer: Middleware for handling file uploads.
pdf-lib: Library for working with PDF files.
Body-parser: Middleware for parsing request bodies.
HTML, CSS, JavaScript: Frontend components for user interaction.

Clone the repository:
git clone <repository_url>
cd <repository_directory>


Install dependencies:
npm install

Start the server:
node server.js


Access the application in your web browser at http://localhost:3000.
Click on the "Upload PDF" button and select a PDF file from your device.
After uploading, checkboxes will appear for each page in the PDF.
Select the pages you want to extract by checking the corresponding checkboxes.
Click on the "Extract Selected Pages" button to create a new PDF with the selected pages.
Once the extraction is complete, the new PDF will be downloaded automatically.