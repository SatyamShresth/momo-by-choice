import cloudinary, { cloudinaryEnabled } from "../config/cloudinary.js";

// Cloudinary file ka asli content check karta hai (allowed_formats), sirf naam ya header nahi.
export function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "momo-by-choice/menu",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1200, height: 1200, crop: "limit" }],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

// Delivery par auto format aur quality, taaki mobile par photo halki aaye.
export const optimizedUrl = (secureUrl) => secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");

export async function deleteImage(publicId) {
  if (!publicId || !cloudinaryEnabled) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }
}