import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { serialize } from "cookie";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@/app/lib/mongodb";
import { sign } from "jsonwebtoken";
import ms from "ms";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await connectToDatabase();

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return NextResponse.json(
        { error: "Email does not exist!" },
        { status: 401 }
      );
    }

    const passwordMatch = await compare(password, checkUser.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect password!" },
        { status: 401 }
      );
    }

    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;
    if (!secret) {
      throw new Error("JWT secret is not defined");
    }

    const payload = {
      id: checkUser._id,
      username: checkUser.username,
      email: checkUser.email,
      role: checkUser.role,
    };

    const expiresIn: ms.StringValue =
      (process.env.NEXT_PUBLIC_JWT_EXPIRES_IN as ms.StringValue) || "1h";

    const token = sign(payload, secret, { expiresIn });

    // const token = sign(
    //   {
    //     id: checkUser._id,
    //     username: checkUser.username,
    //     email: checkUser.email,
    //     role: checkUser.role,
    //   },
    //   secret,
    //   { expiresIn }
    // );

    const serialized = serialize("JWTToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    const response = {
      message: "Authenticated",
      data: {
        id: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Set-Cookie": serialized,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
