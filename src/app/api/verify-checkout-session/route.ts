// src/app/api/verify-checkout-session/route.ts
import Stripe from "stripe";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "customer"],
    });

    // Provjeri da li narudžba već postoji
    const existingOrder = await Order.findOne({ stripeSessionId: session.id });
    if (existingOrder) return NextResponse.json({ order: existingOrder });

    const items =
      session.line_items?.data.map((item: any) => ({
        _id: item.price.product,
        name: item.description,
        price: item.amount_total / 100,
        quantity: item.quantity,
        imageUrl: "", // opcionalno
      })) || [];

    const newOrder = await Order.create({
      firstName: session.metadata?.firstName || "",
      lastName: session.metadata?.lastName || "",
      email: session.customer_details?.email || "",
      phone: session.metadata?.phone || "",
      address: session.metadata?.address || "",
      city: session.metadata?.city || "",
      zip: session.metadata?.zip || "",
      username: session.metadata?.username || "",
      items,
      totalPrice: parseFloat(session.metadata?.totalPrice || "0"),
      shippingCost: parseFloat(session.metadata?.shippingCost || "0"),
      finalPrice: parseFloat(session.metadata?.finalPrice || "0"),
      paymentType: "stripe",
      isPaid: true,
      stripeSessionId: session.id,
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    );
  }
}
