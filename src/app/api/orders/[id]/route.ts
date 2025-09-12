import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDatabase();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Narudžba nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbe:", error);
    return NextResponse.json(
      { error: "Greška pri dohvaćanju narudžbe" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { status } = await req.json();

    if (!status || typeof status !== "string") {
      return NextResponse.json(
        { error: "Status je obavezan i mora biti string" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Narudžba nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Greška pri ažuriranju statusa:", error);
    return NextResponse.json(
      { error: "Greška pri ažuriranju narudžbe" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = await params;

//   try {
//     await connectToDatabase();
//     const updatedData = await request.json();

//     const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedOrder) {
//       return NextResponse.json(
//         { error: "Narudžba nije pronađena" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Narudžba uspješno ažurirana", data: updatedOrder },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Greška pri ažuriranju narudžbe:", error);
//     return NextResponse.json(
//       { error: "Greška prilikom ažuriranja narudžbe" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDatabase();

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json(
        { error: "Narudžba nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Narudžba je obrisana" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Greška pri brisanju narudžbe:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
