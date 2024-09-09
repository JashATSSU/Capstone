// src/utils/s3Client.js

import AWS from 'aws-sdk';

// Configure AWS with environment variables
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION
});

// Create an S3 instance
const s3 = new AWS.S3();

// Log configuration for debugging (be cautious with sensitive info in production)
console.log('S3 client configured with region:', AWS.config.region);

export default s3;
