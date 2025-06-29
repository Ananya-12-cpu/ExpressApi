const multer = require("multer");

const uploadErrorHandler = (error, req, res, next) => {
 
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Maximum file size is 10MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Too many files. Maximum 10 files allowed.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        error: "Unexpected file field.",
      });
    }
  }

  if (error.message.includes("Invalid file type")) {
    return res.status(400).json({
      error: error.message,
    });
  }

  // For other errors
  console.error("Upload error:", error);
  res.status(500).json({
    error: "Error processing file upload",
  });
};

module.exports = uploadErrorHandler;
