/**
 * Magnetic variation as printed on a chart compass rose, e.g.
 *   VAR 15°00′E (2025)  ANNUAL CHANGE 6′W
 * Everything is handled in signed arc-minutes (East +, West −); 60′ = 1°.
 */
import type { EastWest } from './bearing';

export function toSignedMinutes(degrees: number, minutes: number, dir: EastWest): number {
  const total = Math.abs(degrees) * 60 + Math.abs(minutes);
  return dir === 'E' ? total : -total;
}

export function fromSignedMinutes(signedMinutes: number): {
  degrees: number;
  minutes: number;
  dir: EastWest | null;
} {
  const rounded = Math.round(signedMinutes);
  const abs = Math.abs(rounded);
  return {
    degrees: Math.floor(abs / 60),
    minutes: abs % 60,
    dir: rounded === 0 ? null : rounded > 0 ? 'E' : 'W',
  };
}

/**
 * Variation for `targetYear`, given the rose value for `baseYear` and its annual change
 * (both signed minutes). Years before the base year run the change backwards.
 */
export function updateVariation(
  baseSignedMinutes: number,
  annualChangeSignedMinutes: number,
  baseYear: number,
  targetYear: number,
): number {
  return baseSignedMinutes + annualChangeSignedMinutes * (targetYear - baseYear);
}

/** 870 → "14°30′ E". */
export function formatVariation(signedMinutes: number): string {
  const { degrees, minutes, dir } = fromSignedMinutes(signedMinutes);
  const body = `${degrees}°${String(minutes).padStart(2, '0')}′`;
  return dir ? `${body} ${dir}` : body;
}

/** Signed decimal degrees, for feeding into the bearing functions. */
export function minutesToDegrees(signedMinutes: number): number {
  return signedMinutes / 60;
}
