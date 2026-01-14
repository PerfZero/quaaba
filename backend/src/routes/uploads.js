const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadsRoot = path.join(__dirname, "..", "uploads");
const transportsDir = path.join(uploadsRoot, "transports");

fs.mkdirSync(transportsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, transportsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext ? ext.toLowerCase() : "";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// POST /api/uploads/transports - Загрузка фото транспорта
router.post("/transports", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Файл не загружен" });
  }

  const urlPath = `/uploads/transports/${req.file.filename}`;
  res.json({ url: urlPath });
});

module.exports = router;
