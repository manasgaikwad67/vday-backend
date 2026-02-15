const Memory = require("../models/Memory");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "memories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  cb(null, ext && mime);
};

exports.upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

exports.create = async (req, res) => {
  try {
    const { title, caption, date } = req.body;
    const userId = req.userId || null;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imageUrl = `/uploads/memories/${req.file.filename}`;
    const memory = await Memory.create({ userId, title, caption, date, imageUrl });

    res.status(201).json({ success: true, memory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const userId = req.userId || null;
    const query = userId ? { userId } : { userId: null };
    const memories = await Memory.find(query).sort({ date: 1 });
    res.json({ success: true, memories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, caption, date } = req.body;
    const userId = req.userId || null;
    const updateData = { title, caption, date };

    if (req.file) {
      updateData.imageUrl = `/uploads/memories/${req.file.filename}`;
    }

    const filter = userId ? { _id: req.params.id, userId } : { _id: req.params.id };
    const memory = await Memory.findOneAndUpdate(filter, updateData, { new: true });
    if (!memory) {
      return res.status(404).json({ success: false, message: "Memory not found" });
    }

    res.json({ success: true, memory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const userId = req.userId || null;
    const filter = userId ? { _id: req.params.id, userId } : { _id: req.params.id };
    const memory = await Memory.findOneAndDelete(filter);
    if (!memory) {
      return res.status(404).json({ success: false, message: "Memory not found" });
    }

    // Remove image file
    const imagePath = path.join(__dirname, "..", memory.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ success: true, message: "Memory deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
