/**
 * Bearing arithmetic with a signed-variation convention:
 * East variation (and deviation) is positive, West is negative.
 *
 *   Magnetic = True − Variation      True = Magnetic + Variation
 *   Compass  = Magnetic − Deviation  Magnetic = Compass + Deviation
 */

export type EastWest = 'E' | 'W';

/** Map any angle into [0, 360). */
export function normalize(deg: number): number {
  const r = ((deg % 360) + 360) % 360;
  return r === 360 ? 0 : r;
}

/** 15, 'W' → −15. Magnitude is taken as absolute so the direction alone sets the sign. */
export function signed(magnitude: number, dir: EastWest): number {
  return dir === 'E' ? Math.abs(magnitude) : -Math.abs(magnitude);
}

export function trueToMagnetic(trueBearing: number, variation: number): number {
  return normalize(trueBearing - variation);
}

export function magneticToTrue(magneticBearing: number, variation: number): number {
  return normalize(magneticBearing + variation);
}

export function magneticToCompass(magneticBearing: number, deviation: number): number {
  return normalize(magneticBearing - deviation);
}

export function compassToMagnetic(compassBearing: number, deviation: number): number {
  return normalize(compassBearing + deviation);
}

/** Whole-degree, three-digit bearing: 5 → "005°", 359.6 → "000°". */
export function formatBearing(deg: number): string {
  const whole = normalize(Math.round(deg));
  return `${String(whole).padStart(3, '0')}°`;
}

/** "15° E" / "15° W" / "0°" for a signed angle. */
export function formatSignedDegrees(deg: number): string {
  if (deg === 0) return '0°';
  const mag = Math.abs(deg);
  const txt = Number.isInteger(mag) ? String(mag) : mag.toFixed(1);
  return `${txt}° ${deg > 0 ? 'E' : 'W'}`;
}

/** The arithmetic written out, e.g. "270° − (−15°) = 285°". */
export function explainTrueToMagnetic(trueBearing: number, variation: number): string {
  const v = variation < 0 ? `(−${Math.abs(variation)}°)` : `${variation}°`;
  const raw = trueBearing - variation;
  const result = trueToMagnetic(trueBearing, variation);
  const wrap = raw !== result ? ` → normalized to ${formatBearing(result)}` : '';
  return `${trueBearing}° − ${v} = ${raw}°${wrap}`;
}

export function explainMagneticToTrue(magneticBearing: number, variation: number): string {
  const v = variation < 0 ? `(−${Math.abs(variation)}°)` : `${variation}°`;
  const raw = magneticBearing + variation;
  const result = magneticToTrue(magneticBearing, variation);
  const wrap = raw !== result ? ` → normalized to ${formatBearing(result)}` : '';
  return `${magneticBearing}° + ${v} = ${raw}°${wrap}`;
}

/** Reciprocal (back) bearing. */
export function reciprocal(deg: number): number {
  return normalize(deg + 180);
}

/** Smallest absolute difference between two bearings, 0–180. */
export function angularDifference(a: number, b: number): number {
  const d = Math.abs(normalize(a) - normalize(b));
  return d > 180 ? 360 - d : d;
}
