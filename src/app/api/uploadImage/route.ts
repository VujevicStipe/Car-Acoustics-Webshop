import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Nema slike" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<NextResponse>((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "product-images",
          public_id: uuidv4(),
          use_filename: false,
          unique_filename: false,
          timeout: 60000,
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary greška:", error);
            return resolve(
              NextResponse.json({ error: "Upload nije uspio" }, { status: 500 })
            );
          }

          return resolve(
            NextResponse.json(
              { secure_url: result.secure_url },
              { status: 200 }
            )
          );
        }
      )
      .end(buffer);
  });
}
