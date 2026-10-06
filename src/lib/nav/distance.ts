/**
 * Distance on a chart at kayak scale.
 *  - 1′ of latitude = 1 nautical mile (by definition, to within a fraction of a percent).
 *  - 1′ of longitude ≈ cos(latitude) NM, because meridians converge toward the poles.
 * The east-west / north-south split is a flat-earth approximation that is fine over a few miles.
 */

export const KM_PER_NM = 1.852;
export const SM_PER_NM = 1852 / 1609.344; // ≈ 1.1508
export const MINUTES_PER_DEGREE = 60;

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function nmToKm(nm: number): number {
  return nm * KM_PER_NM;
}

export function nmToStatuteMiles(nm: number): number {
  return nm * SM_PER_NM;
}

/** Length of one minute of longitude, in NM, at a latitude in degrees. */
export function lonMinuteNm(latitudeDeg: number): number {
  return Math.max(0, Math.cos(rad(latitudeDeg)));
}

export interface LegDistance {
  northSouthNm: number;
  eastWestNm: number;
  totalNm: number;
}

/** Δlat and Δlon in minutes of arc, at the route's mean latitude. */
export function legDistance(latitudeDeg: number, dLatMinutes: number, dLonMinutes: number): LegDistance {
  const northSouthNm = Math.abs(dLatMinutes);
  const eastWestNm = Math.abs(dLonMinutes) * lonMinuteNm(latitudeDeg);
  return { northSouthNm, eastWestNm, totalNm: Math.hypot(northSouthNm, eastWestNm) };
}

export interface Position {
  lat: number; // decimal degrees, + north
  lon: number; // decimal degrees, + east (Puget Sound longitudes are negative)
}

/**
 * Distance and true course from `a` to `b` using mid-latitude sailing.
 * Accurate to well under 1% for the few-mile legs a kayaker plans.
 */
export function courseAndDistance(a: Position, b: Position): { distanceNm: number; trueCourse: number } {
  const midLat = (a.lat + b.lat) / 2;
  const northNm = (b.lat - a.lat) * MINUTES_PER_DEGREE;
  const eastNm = (b.lon - a.lon) * MINUTES_PER_DEGREE * lonMinuteNm(midLat);
  const course = (deg(Math.atan2(eastNm, northNm)) + 360) % 360;
  return { distanceNm: Math.hypot(northNm, eastNm), trueCourse: course };
}

/** Time to cover a distance at a speed in knots, in minutes. */
export function transitMinutes(distanceNm: number, speedKnots: number): number {
  if (speedKnots <= 0) return Infinity;
  return (distanceNm / speedKnots) * 60;
}
