/**
 * Latitude/longitude in degrees and decimal minutes (DDM) — the format most GPS units and
 * chart borders use, e.g. 47°31.20′ N 122°28.50′ W.
 * Internally: signed decimal degrees, + north / + east.
 */

export type Axis = 'lat' | 'lon';

export interface DDM {
  degrees: number;
  minutes: number;
  hemisphere: 'N' | 'S' | 'E' | 'W';
}

export function toDDM(decimal: number, axis: Axis): DDM {
  const abs = Math.abs(decimal);
  let degrees = Math.floor(abs);
  let minutes = (abs - degrees) * 60;
  // Guard against 59.9999… rounding up to 60 when formatted.
  if (60 - minutes < 1e-9) {
    degrees += 1;
    minutes = 0;
  }
  const hemisphere = axis === 'lat' ? (decimal < 0 ? 'S' : 'N') : decimal < 0 ? 'W' : 'E';
  return { degrees, minutes, hemisphere };
}

export function formatDDM(decimal: number, axis: Axis, decimals = 2): string {
  const factor = 10 ** decimals;
  const rounded = Math.round(Math.abs(decimal) * 60 * factor) / factor / 60;
  const { degrees, minutes, hemisphere } = toDDM(decimal < 0 ? -rounded : rounded, axis);
  const width = axis === 'lon' ? 3 : 2;
  const mm = minutes.toFixed(decimals).padStart(decimals > 0 ? 3 + decimals : 2, '0');
  return `${String(degrees).padStart(width, '0')}°${mm}′ ${hemisphere}`;
}

export function fromDDM(degrees: number, minutes: number, hemisphere: DDM['hemisphere']): number {
  const value = Math.abs(degrees) + Math.abs(minutes) / 60;
  return hemisphere === 'S' || hemisphere === 'W' ? -value : value;
}

/**
 * Parse a single coordinate such as "47 31.2 N", "47°31.20′N", "122° 28.5' W", "-122 28.5".
 * Returns signed decimal degrees, or null if it cannot be read or is out of range.
 */
export function parseDDM(input: string, axis: Axis): number | null {
  const s = input.trim().toUpperCase().replace(/[°′'’]/g, ' ');
  const m = s.match(/^(-)?\s*(\d{1,3})\s+(\d{1,2}(?:\.\d+)?)\s*([NSEW])?$/);
  if (!m) return null;
  const [, neg, d, mins, hemi] = m;
  const degrees = Number(d);
  const minutes = Number(mins);
  if (minutes >= 60) return null;
  if (hemi) {
    if (axis === 'lat' && !'NS'.includes(hemi)) return null;
    if (axis === 'lon' && !'EW'.includes(hemi)) return null;
  }
  let value = degrees + minutes / 60;
  if (neg || hemi === 'S' || hemi === 'W') value = -value;
  const limit = axis === 'lat' ? 90 : 180;
  if (Math.abs(value) > limit) return null;
  return value;
}
