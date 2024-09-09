const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// AWS S3 configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

// Directory containing maps
const mapsDir = '/path/to/maps/new-england/'; // Update this path

// Function to upload a file to S3
const uploadFile = async (filePath) => {
  const fileName = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);
  const fileContentType = mime.lookup(filePath) || 'application/octet-stream'; // Default to octet-stream if unknown

  const uploadParams = {
    Bucket: bucketName,
    Key: `new-england/${Date.now().toString()}-${fileName}`,
    Body: fileStream,
    ContentType: fileContentType
  };

  try {
    await s3.upload(uploadParams).promise();
    console.log(`Uploaded ${fileName}`);
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
  }
};

// Upload all files in the directory
const uploadFiles = async () => {
  try {
    const files = await fs.promises.readdir(mapsDir);
    for (const file of files) {
      const filePath = path.join(mapsDir, file);
      await uploadFile(filePath);
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
};

uploadFiles();
