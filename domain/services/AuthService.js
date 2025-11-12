// domain/services/AuthService.js
import jwt from "jsonwebtoken";
import User from "@/models/User.js";
import OtpSession from "@/models/OtpSession.js";

class AuthService {
  static OTP_TTL_MS = 1000 * 60 * 5; // 5 minutes

  static generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
  }

  static async requestOTP(phone) {
    if (!phone) throw new Error("phone required");
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + this.OTP_TTL_MS);

    await OtpSession.findOneAndUpdate(
      { phone },
      { code, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // In prod: call Twilio here. For dev: log it
    console.log(`[AuthService] OTP for ${phone}: ${code} (expires ${expiresAt.toISOString()})`);

    // Return debug code in development if you want (optional)
    if (process.env.NODE_ENV !== "production") {
      return { ok: true, message: "OTP sent (mock)", debugCode: code };
    }
    return { ok: true, message: "OTP sent (mock)" };
  }

  static async verifyOTP(phone, code) {
    if (!phone || !code) throw new Error("phone and code required");

    const session = await OtpSession.findOne({ phone });
    if (!session) throw new Error("no otp requested for phone");

    if (Date.now() > session.expiresAt.getTime()) {
      // cleanup
      await OtpSession.deleteOne({ phone });
      throw new Error("otp expired");
    }

    if (String(code) !== String(session.code)) {
      throw new Error("invalid otp");
    }

    // OTP valid: remove it
    await OtpSession.deleteOne({ phone });

    // find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name: "New User", role: "CUSTOMER" });
    }

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
    const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "2d" });

    return { token, user };
  }
}

export default AuthService;
