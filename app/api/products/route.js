// app/api/products/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);

  const filter = q ? { title: new RegExp(q, "i") } : {};
  const total = await Product.countDocuments(filter);
  const results = await Product.find(filter).skip((page - 1) * limit).limit(limit).lean();

  return new Response(JSON.stringify({ data: results, meta: { page, limit, total } }), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const p = await Product.create(body);
  return new Response(JSON.stringify({ product: p }), { status: 201 });
}
