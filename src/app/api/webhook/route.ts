// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/app/models/Order";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // metadata koje si poslao prilikom kreiranja checkout session
    const metadata = session.metadata || {};

    const items = JSON.parse(metadata.items || "[]"); // pretpostavljamo da šalješ stringified array
    const totalPrice = Number(metadata.totalPrice || 0);
    const shippingCost = Number(metadata.shippingCost || 0);

    // connect to MongoDB (ako već nije)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI!);
    }

    try {
      const newOrder = new Order({
        firstName: metadata.firstName,
        lastName: metadata.lastName,
        email: metadata.email,
        phone: metadata.phone,
        address: metadata.address,
        city: metadata.city,
        zip: metadata.zip,
        username: metadata.username,
        items,
        totalPrice,
        shippingCost,
        finalPrice: totalPrice + shippingCost,
        paymentType: "stripe",
        isPaid: true,
        createdAt: new Date(),
      });

      await newOrder.save();
      console.log("Order saved to DB:", newOrder._id);
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  }

  return NextResponse.json({ received: true });
}
