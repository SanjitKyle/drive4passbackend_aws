const express = require('express');
const router = express.Router();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME;

// POST /api/ds/uploads/presign
router.post('/uploads/presign', async (req, res) => {
  const { fileName, fileType, folder } = req.body;

  if (!fileName || !fileType || !folder) {
    return res.status(400).json({ success: false, message: 'fileName, fileType and folder are required' });
  }

  const key = `${folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
    const fileUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ success: true, uploadUrl, fileUrl });
  } catch (error) {
    console.error('S3 presign error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate presigned URL' });
  }
});

module.exports = router;
