import { connectDB } from "@/lib/db";
import AuthService from "@/domain/services/AuthService";

export async function POST(req) {
  await connectDB();
  try {
    const { phone, code } = await req.json();
    const { token, user } = await AuthService.verifyOTP(phone, code);
    return new Response(JSON.stringify({ ok: true, token, user: { id: user._id, phone: user.phone, role: user.role } }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
