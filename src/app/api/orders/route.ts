import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const filter: any = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    console.log("FILTER:", filter);

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}
