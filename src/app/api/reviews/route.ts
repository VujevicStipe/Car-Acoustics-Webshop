import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/mongodb";
import Review from "@/app/models/Review";
import "@/app/models/User"; 
import mongoose from "mongoose";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;

function getUserIdFromRequest(request: NextRequest): string | null {
  const cookieName = process.env.COOKIE_NAME || "JWTToken";
  const token = request.cookies.get(cookieName)?.value;
  console.log("JWT Cookie:", token);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log("JWT Payload:", payload);
    return payload.id;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, rating, comment } = await request.json();

  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      product: new mongoose.Types.ObjectId(productId),
      user: new mongoose.Types.ObjectId(userId),
      rating,
      comment,
    });
    await review.populate("user", "_id username");
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({
      product: new mongoose.Types.ObjectId(productId),
    })
      .populate("user", "_id username")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
