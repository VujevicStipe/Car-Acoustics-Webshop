import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.status) {
      data.status = "processing";
    }

    await connectToDatabase();

    for (const item of data.items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return NextResponse.json(
          { message: `Proizvod ${item.name} nije pronađen.` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `Nema dovoljno zaliha za proizvod ${item.name} (na skladištu: ${product.stock}).`,
          },
          { status: 400 }
        );
      }

      product.stock -= item.quantity;
      product.totalSold = (product.totalSold || 0) + item.quantity;

      await product.save();
    }

    const newOrder = new Order(data);
    await newOrder.save();

    return NextResponse.json(
      { message: "Narudžba spremljena i stock ažuriran." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Greška pri spremanju narudžbe:", err);
    return NextResponse.json(
      { message: "Greška na serveru." },
      { status: 500 }
    );
  }
}
