// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    console.log("[LOGIN] called");
    const body = await req.json();
    console.log("[LOGIN] body:", { email: body.email && body.email.slice(0,40) });
    await connectDB();

    const { email, password } = body;
    if (!email || !password) {
      console.log("[LOGIN] missing credentials");
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("[LOGIN] user not found:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log("[LOGIN] bad password for:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign({ uid: String(user._id), role: user.role }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    const res = NextResponse.json({ message: "Logged in", name: user.name, role: user.role, email: user.email });
    res.headers.set("Set-Cookie", cookie);
    console.log("[LOGIN] success for:", email);
    return res;
  } catch (err) {
    console.error("[LOGIN] error:", err && err.message, err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
