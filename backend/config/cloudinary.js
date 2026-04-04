import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

function cleanEnv(value = "") {
  return String(value).trim().replace(/^["']|["']$/g, "");
}

const cloudName = cleanEnv(process.env.CLOUDINARY_CLOUD_NAME || "");
const apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY || "");
const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET || "");
const cloudinaryUrl = cleanEnv(process.env.CLOUDINARY_URL || "");

const hasExplicitConfig = cloudName && apiKey && apiSecret;

if (hasExplicitConfig) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else if (cloudinaryUrl) {
  cloudinary.config(cloudinaryUrl);
}

export default cloudinary;