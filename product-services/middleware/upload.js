const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // Store files in memory for later use with ImgBB

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
});

module.exports = upload;
