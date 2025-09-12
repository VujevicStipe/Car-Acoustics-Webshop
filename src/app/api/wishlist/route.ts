import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/mongodb";
import Wishlist from "@/app/models/Wishlist";
import "@/app/models/User";
import "@/app/models/Product";
import mongoose from "mongoose";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;

function getUserIdFromRequest(request: NextRequest): string | null {
  const cookieName = process.env.COOKIE_NAME || "JWTToken";
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return payload.id;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const wishlistItem = await Wishlist.findOneAndUpdate(
      { user: userId, product: productId },
      {},
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("product", "_id name price image");

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const items = await Wishlist.find({ user: userId })
      .populate("product", "_id name price imageUrl")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
