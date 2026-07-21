const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (filePath, folder, mimeType) => {
  const BUCKET = process.env.S3_BUCKET_NAME;
  
  // Extract file name from path handling both Windows and Unix separators
  const fileName = filePath.split(/[/\\]/).pop();
  const key = `${folder}/${Date.now()}-${fileName}`;
  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileStream,
    ContentType: mimeType,
  });

  await s3.send(command);
  
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = uploadToS3;
