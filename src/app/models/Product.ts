import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: String,
    specs: Object,
    stock: { type: Number, required: true, default: 0 },
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
