// src/app/api/retailers/nearby/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function GET(req) {
  // Next.js App Router: use req.nextUrl for search params
  const url = req.nextUrl || new URL(req.url);
  const latStr = url.searchParams.get("lat");
  const lngStr = url.searchParams.get("lng");
  const radiusKmStr = url.searchParams.get("radiusKm") || "10";

  console.log("API /api/retailers/nearby called with lat,lng,radiusKm:", latStr, lngStr, radiusKmStr);

  const lat = parseFloat(latStr || "0");
  const lng = parseFloat(lngStr || "0");
  const radiusKm = parseFloat(radiusKmStr || "10");
  const maxDistance = Math.max(1, radiusKm) * 1000; // meters

  await connectDB();

  // simple schema to allow raw collection query
  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }), "users");

  try {
    const retailers = await User.find({
      role: "RETAILER",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance
        }
      }
    }).lean();

    console.log("Geo query returned:", retailers.length);
    return NextResponse.json({ retailers });
  } catch (err) {
    console.error("Geo query error:", err && err.message);
    // fallback: try geoWithin as alternative
    try {
      const R = (radiusKm / 6378.1); // radians
      const alt = await User.find({
        role: "RETAILER",
        location: { $geoWithin: { $centerSphere: [[lng, lat], R] } }
      }).lean();
      console.log("geoWithin returned:", alt.length);
      return NextResponse.json({ retailers: alt });
    } catch (err2) {
      console.error("geoWithin error:", err2 && err2.message);
      return NextResponse.json({ retailers: [] });
    }
  }
}
