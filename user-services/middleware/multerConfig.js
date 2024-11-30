const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // This is the folder where the uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with unique name
  },
});

// File filter to accept only certain types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only jpg and png files are allowed'), false); // Reject the file
  }
};

// Initialize multer with the storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit the file size to 10MB
  fileFilter: fileFilter,
});

// Export the middleware
module.exports = upload;
