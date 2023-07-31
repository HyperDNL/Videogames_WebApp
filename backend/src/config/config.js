import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT;
export const WHITELISTED_DOMAINS = process.env.WHITELISTED_DOMAINS;
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const MAX_IMAGE_SIZE_MB = process.env.MAX_IMAGE_SIZE_MB;
export const ALLOWED_IMAGE_EXTENSIONS = JSON.parse(
  process.env.ALLOWED_IMAGE_EXTENSIONS
);
