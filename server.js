const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Use body-parser middleware to parse JSON bodies

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the path to the uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original filename
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "src" directory
app.use(express.static('src'));

// Upload endpoint
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  // Handle file upload
  res.status(200).send('File uploaded successfully.');
});

// Endpoint to fetch PDF details (total pages)

app.get('/pdf-details/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName);
  
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPages().length;
    res.json({ totalPages: totalPages });
  } catch (error) {
    console.error('Error fetching PDF details:', error);
    res.status(500).send('Error fetching PDF details.');
  }
});


// Extract pages and serve the newly created PDF for download
app.post('/extract', async (req, res) => {
  const selectedPages = req.body.selectedPages.split(',').map(Number);
  const inputFileName = req.body.fileName;
  
  const inputPath = path.join(__dirname, 'uploads', inputFileName);
  const outputPath = path.join(__dirname, 'downloads', inputFileName);

  try {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath));
    const newDoc = await PDFDocument.create();

    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newDoc.save();

    fs.writeFileSync(outputPath, newPdfBytes);

    res.download(outputPath);
  } catch (error) {
    console.error('Error extracting PDF:', error);
    res.status(500).send('Error extracting PDF.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});