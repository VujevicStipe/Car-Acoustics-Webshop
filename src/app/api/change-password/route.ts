import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/User";

const cookieName = process.env.COOKIE_NAME || "JWTToken";
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY!;

function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get(cookieName)?.value;
  console.log("JWT Cookie:", token);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log("decoded", decoded);
    return decoded.id;
  } catch (e) {
    console.log("JWT decode error:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password changed successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
