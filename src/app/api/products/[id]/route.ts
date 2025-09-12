import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDatabase();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Greška pri dohvaćanju proizvoda:", error);
    return NextResponse.json(
      { error: "Greška pri dohvaćanju proizvoda" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDatabase();
    const updatedData = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Proizvod uspješno ažuriran", data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Greška pri ažuriranju proizvoda:", error);
    return NextResponse.json(
      { error: "Greška prilikom ažuriranja proizvoda" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Proizvod je obrisan" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Greška pri brisanju proizvoda:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
