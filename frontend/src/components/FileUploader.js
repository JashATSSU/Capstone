// src/components/FileUploader.js

import React, { useState } from 'react';
import s3 from '../utils/s3Client'; // Import the S3 client

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        const params = {
            Bucket: 'your-bucket-name', // Replace with your bucket name
            Key: file.name,
            Body: file,
            ACL: 'public-read' // Set permissions
        };

        try {
            const data = await s3.upload(params).promise();
            setUploadStatus(`File uploaded successfully: ${data.Location}`);
        } catch (err) {
            setUploadStatus(`Error uploading file: ${err.message}`);
        }
    };

    return (
        <div className="file-uploader">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>Upload to S3</button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default FileUploader;
