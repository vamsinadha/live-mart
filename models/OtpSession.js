// models/OtpSession.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const otpSchema = new Schema({
  phone: { type: String, unique: true, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// optional: automatic TTL index if supported
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OtpSession || mongoose.model("OtpSession", otpSchema);
