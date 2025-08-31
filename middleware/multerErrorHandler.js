const multer = require("multer");

// Multer error handler middleware
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    let message;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size too large. Max 20MB allowed.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Too many files uploaded or unexpected field.";
        break;
      default:
        message = `Multer error: ${err.message}`;
    }

    return res.status(400).json({ success: false, error: message });
  } else if (err) {
    // Custom errors (from fileFilter or others)
    console.log(err)
    return res.status(400).json({ success: false, error: err.message });
  }

  // If no error, pass to next middleware
  next();
};

module.exports = multerErrorHandler;
