import multer from "multer";
import AppError from "../utils/AppError.js";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, cb) {
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(new AppError("Sirf JPG, PNG ya WebP photo chalegi.", 400));
  },
}).single("image");