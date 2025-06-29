const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Allow common file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, PDFs, documents, and text files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const uploadFile = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File too large. Maximum size is 10MB." });
        }
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        uploadedBy: req.user.id,
        description: req.body.description || null,
      };

      const savedFile = await File.create(fileData);

      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          id: savedFile.id,
          filename: savedFile.filename,
          originalName: savedFile.originalName,
          mimetype: savedFile.mimetype,
          size: savedFile.size,
          description: savedFile.description,
          uploadedAt: savedFile.createdAt,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Error uploading file" });
    }
  });
};

// Get all files (with pagination)
const getAllFiles = async (req, res) => {
  try {
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const offset = (page - 1) * limit;

    // First, let's test without the include to see if the basic query works
    const { count, rows: files } = await File.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    res.json({
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalFiles: count,
        filesPerPage: limit,
      },
      files: files,
    });
  } catch (error) {
    console.error("Get files error:", error);
    res
      .status(500)
      .json({ error: "Error retrieving files", details: error.message });
  }
};

// Get files by user
const getFilesByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: files } = await File.findAndCountAll({
      where: { uploadedBy: userId },
      include: [
        {
          model: require("../models/User"),
          as: "uploader",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    res.json({
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalFiles: count,
        filesPerPage: limit,
      },
      files: files,
    });
  } catch (error) {
    console.error("Get user files error:", error);
    res.status(500).json({ error: "Error retrieving user files" });
  }
};

// Get single file
const getFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await File.findByPk(fileId, {
      include: [
        {
          model: require("../models/User"),
          as: "uploader",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json({
      files: file,
    });
  } catch (error) {
    console.error("Get files error:", error);
    res
      .status(500)
      .json({ error: "Error retrieving files", details: error.message });
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Error downloading file" });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if user owns the file or has admin privileges
    if (file.uploadedBy !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await file.destroy();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
};

module.exports = {
  upload,
  uploadFile,
  getAllFiles,
  getFilesByUser,
  getFile,
  downloadFile,
  deleteFile,
};
