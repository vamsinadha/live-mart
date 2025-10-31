// app/api/inventory/route.js
import { connectDB } from "@/lib/db";
import Inventory from "@/models/Inventory";

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId");
  if (!ownerId) return new Response(JSON.stringify({ error: "ownerId required" }), { status: 400 });
  const list = await Inventory.find({ ownerId }).lean();
  return new Response(JSON.stringify({ inventory: list }), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json(); // expects ownerRole, ownerId, productId, price, stock
  const created = await Inventory.create(body);
  return new Response(JSON.stringify({ inventory: created }), { status: 201 });
}
