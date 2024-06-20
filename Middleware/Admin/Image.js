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
const upload = multer({ storage: multerStorage }).single('Image'); // Updated field name to 'Image'

const uploadImage = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error uploading images' });
      }

      if (!req.file) { // Updated condition to check if req.file exists
        return res.status(400).json({ error: 'No slider image provided' });
      }

      const file = req.file;
      const originalFileName = file.originalname;
      const cleanedFileName = originalFileName.replace(/\s+/g, '-'); // Replace spaces with hyphens
      const fileName = `${uuidv4()}-${cleanedFileName}`;

      // Upload the file to GCS
      await uploadFile(bucketName, file.buffer, fileName);
      

      // Return the public URL of the uploaded image
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      return res.status(200).json({ imageUrl });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error processing images' });
  }
};

async function uploadFile(bucketName, fileBuffer, fileName) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  await file.save(fileBuffer, {
    metadata: {
      contentType: 'image/jpeg', // Adjust the content type according to your file type
    },
  });

  console.log(`File ${fileName} uploaded to ${bucketName}`);
}

  
    module.exports = {uploadImage};