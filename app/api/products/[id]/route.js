// app/api/products/[id]/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Inventory from "@/models/Inventory";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;
  const product = await Product.findById(id).lean();
  if (!product) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });

  // include simple aggregated inventory for product
  const inventories = await Inventory.find({ productId: id }).lean();
  return new Response(JSON.stringify({ product, inventories }), { status: 200 });
}
