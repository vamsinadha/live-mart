// app/api/orders/[id]/route.js
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req, { params }) {
  await connectDB();
  const order = await Order.findById(params.id).lean();
  if (!order) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return new Response(JSON.stringify({ order }), { status: 200 });
}

export async function PATCH(req, { params }) {
  await connectDB();
  const body = await req.json(); // expects { status: "CONFIRMED" } etc.
  const order = await Order.findByIdAndUpdate(params.id, { $set: body }, { new: true }).lean();
  return new Response(JSON.stringify({ order }), { status: 200 });
}
