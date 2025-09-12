import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import User from "@/app/models/User";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";

// export async function GET(request: Request) {
export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get(
      process.env.NEXT_PUBLIC_COOKIE_NAME || "JWTToken"
    );

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY || "";
    const decoded = verify(token.value, secret) as { id: string };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 }
      );
    }

    const orders = await Order.find({ username: user.username }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ user, orders }, { status: 200 });
  } catch (err) {
    console.error("Greška:", err);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, email, password, role } = (await request.json()) as User;

    await connectToDatabase();

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return NextResponse.json(
        { error: "Email is already in use!" },
        { status: 422 }
      );
    }

    const hashedPassword = await hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const savedUserPost = await user.save();

    return NextResponse.json({
      message: "User created successfully",
      data: savedUserPost,
    });
  } catch {
    return NextResponse.json("Can't make an user");
  }
}
