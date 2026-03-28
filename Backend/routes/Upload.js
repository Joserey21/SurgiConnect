const express = require("express"); // Import Express framework
const multer = require("multer"); //Import
const fs = require("fs");
const path = require("path"); // Import path module for handling file paths

const router = express.Router();// Create a new router instance
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create multer instance with the defined storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
// Define a POST route for file uploads
router.post("/upload", (req, res) => {
  upload.single("file")(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File must be 5MB or less" });
    }

    if (error) {
      return res.status(400).json({ error: error.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    return res.status(201).json({
      message: "File uploaded successfully",
      file: req.file.filename,
    });
  });
});
// Export the router to be used in the main server file
module.exports = router;