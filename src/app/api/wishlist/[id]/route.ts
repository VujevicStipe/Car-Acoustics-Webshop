import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/mongodb";
import Wishlist from "@/app/models/Wishlist";
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: wishlistId } = await params;
  if (!wishlistId) {
    return NextResponse.json({ error: "Missing wishlist ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (!mongoose.isValidObjectId(wishlistId)) {
      return NextResponse.json(
        { error: "Invalid wishlist ID" },
        { status: 400 }
      );
    }

    const item = await Wishlist.findById(wishlistId);
    if (!item) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }

    if (item.user.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await item.deleteOne();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete wishlist item" },
      { status: 500 }
    );
  }
}
