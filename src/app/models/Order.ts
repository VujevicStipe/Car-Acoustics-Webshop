import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  zip: String,
  username: String,
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      imageUrl: String,
    },
  ],
  totalPrice: Number,
  shippingCost: Number,
  finalPrice: Number,
  status: {
    type: String,
    enum: ["processing", "sent", "completed"],
    default: "processing",
  },
  paymentType: {
    type: String,
    enum: ["cash", "stripe"],
    default: "cash",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
