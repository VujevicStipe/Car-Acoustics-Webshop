// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

// cloud_name: "dnocxapus",
// api_key: "663986628471286",
// api_secret: "TSXTz6S6pn_UCFxeYgiE386qw0w",
