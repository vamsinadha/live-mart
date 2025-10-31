import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    // temporary model (no schema restriction)
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }), "users");

    const users = await User.find().select("name email role").lean();
    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
  }
}
