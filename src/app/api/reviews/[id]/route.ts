import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/mongodb";
import Review from "@/app/models/Review";
import User from "@/app/models/User";

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

  const { id: reviewId } = await params;
  if (!reviewId) {
    return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const user = await User.findById(userId);
    const isAdmin = user?.role === "admin";

    if (review.user.toString() !== userId && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await review.deleteOne();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
