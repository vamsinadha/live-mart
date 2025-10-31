// app/api/orders/route.js
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  await connectDB();
  const body = await req.json(); // expects customerId, retailerId, lines:[{productId,qty,unitPrice}], paymentMethod
  const order = await Order.create({ customerId: body.customerId, retailerId: body.retailerId, lines: body.lines, payment: { method: body.paymentMethod || "ONLINE" } });
  return new Response(JSON.stringify({ order }), { status: 201 });
}

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const customerId = url.searchParams.get("customerId");
  const orders = customerId ? await Order.find({ customerId }).lean() : await Order.find().limit(50).lean();
  return new Response(JSON.stringify({ orders }), { status: 200 });
}
