import multer from "multer";
import fs from "fs";
import {ResponseError} from "../../errors/response-error.js";

// create ecg directory
const ecgDir = "./uploads/ecg";
if (!fs.existsSync(ecgDir)) {
  fs.mkdirSync(ecgDir, { recursive: true });
}

// storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ecgDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploadEcg = multer({
  storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Maks 10MB
    fileFilter: (req, file, cb) => {
      const allowed = ["application/xml"];
      if (!allowed.includes(file.mimetype)) {
        return cb(new ResponseError(402,"File type must be xml"), false);
      }
      cb(null, true);
    },
});

export const uploadEcgService = async (file) => {
  try {
    if (!file) {
      throw new ResponseError(401,"No file provided");
    }

    const fileData = {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      timestamp: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace('.', ':'),
    };

    console.log("Received ECG file:", fileData);

    return fileData;
  } catch (error) {
    throw error;
  }
};
