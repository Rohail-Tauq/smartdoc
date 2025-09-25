import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protect } from "../middleware/authMiddleware.js";
import Document from "../models/Document.js";
import fs from "fs";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------
// Multer Config
// ----------------------
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only PDF, DOCX, JPG, PNG allowed."), false);
};

const upload = multer({ storage, fileFilter });

// ----------------------
// Upload Route
// ----------------------
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const doc = await Document.create({
      uploadedBy: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: req.file.filename, // ✅ just store the filename
    });

    res.status(201).json({
      message: "File uploaded successfully",
      document: doc,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Server error while uploading file" });
  }
});

// ----------------------
// Get logged-in user's docs
// ----------------------
router.get("/mydocs", protect, async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

// ----------------------
// Download Route
// ----------------------
router.get("/download/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to download this document" });
    }

    // ✅ Correct full file path
    const filePath = path.join(__dirname, "../uploads", doc.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing from server" });
    }

    res.download(filePath, doc.originalName); // forces download with original filename
  } catch (err) {
    console.error("❌ Download error:", err);
    res.status(500).json({ message: "Failed to download document" });
  }
});

// ----------------------
// Delete Document
// ----------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this document" });
    }

    // File path
    const filePath = path.join(__dirname, "../uploads", doc.filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("⚠️ File deletion error:", err.message);
      }
    });

    // Delete DB record
    await doc.deleteOne();

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Failed to delete document" });
  }
});

export default router;