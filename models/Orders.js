// models/Order.js
import mongoose from "mongoose";

const OrderLineSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  qty: Number,
  unitPrice: Number
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
  method: { type: String, enum: ["ONLINE","OFFLINE"], default: "ONLINE" },
  status: { type: String, enum: ["PENDING","PAID","FAILED","COD"], default: "PENDING" },
  txnId: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lines: [OrderLineSchema],
  status: { type: String, enum: ["PLACED","CONFIRMED","DISPATCHED","DELIVERED","CANCELLED"], default: "PLACED" },
  payment: PaymentSchema,
  delivery: Object
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
