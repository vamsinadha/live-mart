// app/api/auth/otp/verify/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();
  const { phone, code } = await req.json();
  if (!phone || !code) return new Response(JSON.stringify({ error: "phone and code required" }), { status: 400 });

  // TODO: real verification. For now accept any 4+ digit code.
  if (String(code).length < 4) return new Response(JSON.stringify({ error: "invalid code" }), { status: 400 });

  // find or create user (stub)
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, name: "New User", role: "CUSTOMER" });
  }

  // return a basic session token (for now stub jwt-like string)
  const token = `stub-token-${user._id}`;
  return new Response(JSON.stringify({ ok: true, token, user: { id: user._id, phone: user.phone, role: user.role } }), { status: 200 });
}
