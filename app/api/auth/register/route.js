// src/app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    console.log("[REGISTER] called");
    const body = await req.json();
    console.log("[REGISTER] body:", body);
    await connectDB();

    const { name, email, password, role } = body;
    if (!name || !email || !password) {
      console.log("[REGISTER] validation failed");
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      console.log("[REGISTER] email exists:", email);
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || "CUSTOMER" });
    console.log("[REGISTER] created:", user._id);

    return NextResponse.json({ id: user._id, email: user.email, role: user.role, name: user.name }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER] error:", err && err.message, err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
