/**
 * "Fictional Sound" — an invented, Puget-Sound-style chart excerpt. NOT A REAL PLACE.
 *
 * Geometry is authored in nautical miles: x east from the west border, y north from the south
 * border. Those convert to latitude/longitude with the same rule a Mercator chart obeys at this
 * size: 1 NM north = 1′ of latitude, 1 NM east = 1/cos(φ) minutes of longitude.
 */
import { lonMinuteNm, type Position } from '../lib/nav/distance';
import { signed } from '../lib/nav/bearing';
import { toSignedMinutes } from '../lib/nav/variation';

export const LAT0 = 47 + 27 / 60; // south border 47°27′ N
export const LON0 = -(122 + 36 / 60); // west border 122°36′ W
export const REF_LAT = 47.5;
export const COS = lonMinuteNm(REF_LAT); // ≈ 0.676 NM per minute of longitude
export const LAT_MINUTES = 9; // 47°27′ → 47°36′
export const LON_MINUTES = 12; // 122°36′ → 122°24′
export const WIDTH_NM = LON_MINUTES * COS;
export const HEIGHT_NM = LAT_MINUTES;

/** SVG pixels per NM, and margin for the border scales. */
export const PX = 80;
export const MARGIN = 48;
export const SVG_W = WIDTH_NM * PX + MARGIN * 2;
export const SVG_H = HEIGHT_NM * PX + MARGIN * 2;

export type Pt = readonly [number, number]; // [xNm, yNm]

export function sx(xNm: number): number {
  return MARGIN + xNm * PX;
}
export function sy(yNm: number): number {
  return MARGIN + (HEIGHT_NM - yNm) * PX;
}
export function toLatLon([x, y]: Pt): Position {
  return { lat: LAT0 + y / 60, lon: LON0 + x / (60 * COS) };
}
export function fromLatLon(p: Position): Pt {
  return [(p.lon - LON0) * 60 * COS, (p.lat - LAT0) * 60];
}
/** Pixel → NM, for click handling. */
export function fromSvg(px: number, py: number): Pt {
  return [(px - MARGIN) / PX, HEIGHT_NM - (py - MARGIN) / PX];
}
export function path(points: readonly Pt[], close = true): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('') + (close ? 'Z' : '');
}

// ---------- land ----------
export const WEST_MAINLAND: Pt[] = [
  [0, 0], [1.3, 0], [1.5, 0.8], [1.35, 1.7], [1.6, 2.6], [1.55, 3.4], [1.8, 3.9], [2.25, 4.3],
  [2.05, 4.7], [1.6, 5.0], [1.45, 5.8], [1.72, 6.62], [1.55, 7.4], [1.3, 8.2], [1.4, 9], [0, 9],
];
export const ISLAND: Pt[] = [
  [5.3, 3.0], [5.9, 3.1], [6.4, 3.6], [6.5, 4.4], [6.3, 5.2], [6.4, 5.9], [6.0, 6.5], [5.5, 6.75],
  [5.1, 6.4], [4.95, 5.8], [4.9, 5.3], [5.0, 4.6], [4.85, 4.0], [5.0, 3.4],
];
export const EAST_MAINLAND: Pt[] = [
  [7.3, 0], [WIDTH_NM, 0], [WIDTH_NM, 9], [7.4, 9], [7.2, 8.0], [7.45, 7.0], [7.25, 6.0], [7.5, 5.0],
  [7.35, 4.0], [7.55, 3.0], [7.3, 2.0], [7.4, 1.0],
];

/** Offsets (NM) at which the stroke trick draws the depth bands around every shore. */
export const BAND = { drying: 0.07, shallow30: 0.28, line60: 0.55 };

// ---------- named points ----------
export const POINTS = {
  A: [2.22, 4.33] as Pt, // Gull Point beach
  B: [4.93, 5.4] as Pt, // Heron Island west beach
  ferryWest: [1.74, 6.72] as Pt,
  ferryEast: [5.12, 6.42] as Pt,
  bailIslandSW: [4.92, 3.75] as Pt,
  bailMainlandS: [1.62, 3.0] as Pt,
};

// ---------- traffic separation scheme (runs north–south through the channel) ----------
export const TSS = {
  westLane: [3.0, 3.5] as const, // southbound
  zone: [3.5, 3.9] as const,
  eastLane: [3.9, 4.4] as const, // northbound
};

// ---------- hazards, aids, areas ----------
export const SHOAL = { c: [2.6, 3.85] as Pt, rx: 0.32, ry: 0.2, name: 'Cutter Shoal', soundings: [4, 7, 5] };
export const BUOY = { at: [2.85, 4.08] as Pt, label: 'G "3"', light: 'Fl G 4s' };
export const DAYBEACON = { at: [2.02, 4.0] as Pt, label: 'SG "1"' };
export const LIGHTHOUSE = { at: [5.52, 6.72] as Pt, label: 'Heron Pt Lt', light: 'Fl W 6s 40ft 9M' };
export const SUNKEN_ROCK = { at: [4.7, 5.08] as Pt };
export const DRYING_ROCK = { at: [4.72, 3.72] as Pt, height: 3 };
export const WRECK = { at: [2.15, 2.25] as Pt };
export const OBSTRUCTION = { at: [6.85, 5.55] as Pt };
export const KELP = { at: [5.55, 2.72] as Pt };
export const LANDMARK = { at: [0.75, 6.1] as Pt, label: 'TANK' };
export const ANCHORAGE: Pt[] = [[1.95, 7.6], [2.85, 7.6], [2.85, 8.6], [1.75, 8.6]];
export const RESTRICTED: Pt[] = [[1.65, 0.45], [2.75, 0.45], [2.75, 1.5], [1.6, 1.5]];
export const CABLE = { y1: 4.35, y2: 4.6, x1: 6.45, x2: 7.42 };
export const ROSE = { c: [6.15, 1.35] as Pt, r: 0.95 };
export const DRYING_LABEL = { at: [2.14, 4.48] as Pt, height: 2 };

/** The rose is fictional by design — see Constitution III. */
export const ROSE_TEXT = {
  varDeg: 15,
  varMin: 0,
  dir: 'E' as const,
  year: 2025,
  annualMin: 6,
  annualDir: 'W' as const,
};
export const ROSE_VAR_MINUTES = toSignedMinutes(ROSE_TEXT.varDeg, ROSE_TEXT.varMin, ROSE_TEXT.dir);
export const ROSE_ANNUAL_MINUTES = toSignedMinutes(0, ROSE_TEXT.annualMin, ROSE_TEXT.annualDir);
export const ROSE_VAR_DEG = signed(15, 'E');

/** Soundings in feet at MLLW: [x, y, depth]. */
export const SOUNDINGS: [number, number, number][] = [
  [2.6, 6.2, 96], [3.3, 6.9, 210], [3.75, 5.9, 246], [3.2, 5.1, 228], [4.15, 4.9, 204], [3.65, 3.2, 270],
  [3.1, 2.4, 252], [4.3, 1.9, 216], [2.6, 1.9, 84], [4.4, 7.8, 186], [3.4, 8.4, 240], [4.4, 3.6, 138],
  [2.1, 5.35, 42], [1.95, 6.05, 30], [4.55, 6.4, 66], [6.85, 3.3, 54], [6.9, 6.6, 48], [6.95, 7.9, 60],
  [5.4, 7.5, 102], [6.2, 8.3, 90], [2.7, 3.15, 36], [4.6, 2.6, 120], [5.1, 1.0, 168], [3.9, 0.5, 234],
  [4.45, 5.6, 54], [6.88, 4.95, 24],
];

export const CHART_TITLE = {
  name: 'FICTIONAL SOUND',
  sub: 'Puget-Sound-style training excerpt — NOT A REAL PLACE — NOT FOR NAVIGATION',
  datum: 'SOUNDINGS IN FEET AT MEAN LOWER LOW WATER (MLLW)',
  projection: 'Mercator projection · measure with the latitude border or bar scale (screen size varies)',
  note: 'CAUTION: Traffic Separation Scheme in effect — see Rule 10 and the Coast Pilot. Ferry routes approximate.',
};
