import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Greška:", err);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const data = await request.json();
    delete data.password;

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error("Greška:", err);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Korisnik je uspješno obrisan" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Greška:", err);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
