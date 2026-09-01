const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(), "uploads");

// create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  }
});

// Allow all image formats and PDF files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const isImageMime = file.mimetype && file.mimetype.toLowerCase().startsWith("image/");
  const isPdfMime = file.mimetype && file.mimetype.toLowerCase() === "application/pdf";
  const imageExtensions = /\.(jpeg|jpg|png|gif|webp|avif|svg|bmp|tiff|tif|heic|heif|ico|jfif|raw|cr2|nef|orf|sr2)$/i;
  const isImageExt = imageExtensions.test(ext);
  const isPdfExt = ext === ".pdf";

  if (isImageMime || isPdfMime || isImageExt || isPdfExt) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Please upload an image file (PNG, JPG, JPEG, WEBP, GIF, etc.) or a PDF document."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

module.exports = upload;
