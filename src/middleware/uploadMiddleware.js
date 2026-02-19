const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storyDir = path.join(process.cwd(), 'storage/stories');
const coverDir = path.join(process.cwd(), 'storage/covers');

[storyDir, coverDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'pdf') {
      cb(null, storyDir);
    } else {
      cb(null, coverDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF uploads are allowed for stories'));
  }

  if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image uploads are allowed for covers'));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

module.exports = upload;
