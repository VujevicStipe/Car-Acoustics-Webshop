import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const filter = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(filter)
      .select("-password")
      .sort({ username: 1 });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("Greška:", err);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
