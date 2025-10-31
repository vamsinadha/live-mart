// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  images: [String],
  localTags: [String],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
