const { Storage } = require('@google-cloud/storage');
const path = require('path');


exports.deleteImage = async (bucketName, fileName) => {
  // Create a new instance of the storage client
  const storage = new Storage({
    projectId: 'utilitarian-arc-387906',
  keyFilename: '/home/purva/discreit/discreit-api/Middleware/Admin/utilitarian-arc-387906-4b808cb547a3.json',

  });

  // Get a reference to the bucket
  const bucket = storage.bucket(bucketName);

  try {
    // Delete the file
    await bucket.file(fileName).delete();

    console.log(`Deleted file: gs://${bucketName}/${fileName}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};