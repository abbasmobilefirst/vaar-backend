const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const keyFilePath = path.join(__dirname, 'utilitarian-arc-387906-4b808cb547a3.json');


const storage = new Storage({
  projectId: 'utilitarian-arc-387906',
  keyFilename: keyFilePath
});

const bucketName = 'discreit-staging'; // Your GCS bucket name

  // Configure multer storage
  const multerStorage = multer.memoryStorage();
  const upload = multer({ storage: multerStorage }).single('pdfFile');
  
  // Middleware for uploading PDF file
  const uploadPDFMiddleware = (req, res, next) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error uploading the PDF file' });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file provided' });
      }
  
      const pdfFile = req.file;
  
      // Upload the PDF file to Google Cloud Storage
      const fileName = `${uuidv4()}-${pdfFile.originalname}`;
      await uploadFile(bucketName, pdfFile.buffer, fileName, 'application/pdf');

      const fileSize = pdfFile.size;
    const originalFileName = pdfFile.originalname;
   
  
      // Assign the public URL of the uploaded file to the request body or any relevant field in your Mongoose model
      req.body.pdfFile = {
        url: `https://storage.googleapis.com/${bucketName}/${fileName}`,
        name: originalFileName,
        size: fileSize
      };
      next();
    });
  };
  
  // Function to upload a file to Google Cloud Storage
  async function uploadFile(bucketName, fileBuffer, fileName, contentType) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
  
    await file.save(fileBuffer, {
      metadata: {
        contentType: contentType,
      },
    });
  
    console.log(`File ${fileName} uploaded to ${bucketName}`);
  }
  
module.exports = {
    uploadPDFMiddleware


}