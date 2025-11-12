import { connectDB } from "@/lib/db";
import AuthService from "@/domain/services/AuthService";

export async function POST(req) {
  await connectDB();
  try {
    const { phone } = await req.json();
    const resp = await AuthService.requestOTP(phone);
    return new Response(JSON.stringify(resp), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
