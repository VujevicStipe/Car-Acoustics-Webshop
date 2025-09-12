import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { items, metadata } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name || "Proizvod",
          description: item.description || "",
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/checkout-cancel`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Stripe session failed" },
      { status: 500 }
    );
  }
}
