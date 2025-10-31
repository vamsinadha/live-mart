// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  phone: String,
  role: { type: String, enum: ["CUSTOMER","RETAILER","WHOLESALER"], default: "CUSTOMER" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  }
}, { timestamps: true });

UserSchema.index({ location: "2dsphere" });

export default mongoose.models.User || mongoose.model("User", UserSchema);
