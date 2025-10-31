// src/lib/db.js
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB || "livemart";

export async function connectDB() {
  console.log("connectDB() called. Will connect to:", uri, " dbName:", dbName);
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return mongoose.connection;
  }
  try {
    await mongoose.connect(uri, { dbName });
    console.log("✅ Connected to MongoDB:", uri, " db:", dbName);
    return mongoose.connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
