// models/Inventory.js
import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  ownerRole: { type: String, enum: ["RETAILER","WHOLESALER"], required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
  price: Number,
  stock: Number,
  availableFrom: Date
}, { timestamps: true });

InventorySchema.index({ ownerId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);
