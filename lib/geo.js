// lib/geo.js
export function deg2rad(deg) { return deg * (Math.PI / 180); }

export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Helper to build a Mongo $near filter object for queries if needed
 * Example use:
 *   Model.find({
 *     location: {
 *       $near: {
 *         $geometry: { type: 'Point', coordinates: [lng, lat] },
 *         $maxDistance: radiusKm * 1000
 *       }
 *     }
 *   })
 */
export function buildNearQuery(lng, lat, radiusKm = 5) {
  return {
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: Math.round(parseFloat(radiusKm) * 1000)
      }
    }
  };
}
