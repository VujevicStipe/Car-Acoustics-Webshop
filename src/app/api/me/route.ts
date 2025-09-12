import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("JWTToken="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ authenticated: false, user: null });

  try {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY || "";
    const payload = verify(token, secret) as {
      id: string;
      username: string;
      email: string;
      role: string;
    };

    return NextResponse.json({
      authenticated: true,
      user: {
        _id: payload.id,
        username: payload.username,
        role: payload.role,
        email: payload.email,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
