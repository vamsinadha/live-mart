// app/api/auth/otp/request/route.js
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { phone } = body;
  if (!phone) return new Response(JSON.stringify({ error: "phone required" }), { status: 400 });

  // TODO: integrate Twilio Verify. For now return a stubbed response.
  return new Response(JSON.stringify({ ok: true, message: "OTP sent (stub)" }), { status: 200 });
}
