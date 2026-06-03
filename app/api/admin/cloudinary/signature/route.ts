import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdminSession } from "@/lib/auth/admin";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "honey-surgicals/products";

  if (!cloudName || !apiKey || !apiSecret || apiSecret.includes("replace-with")) {
    return NextResponse.json({
      mode: "demo",
      message: "Cloudinary env vars are not configured."
    });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature
  });
}
