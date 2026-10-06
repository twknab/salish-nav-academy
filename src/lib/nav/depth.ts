/**
 * Depth relative to chart datum.
 * U.S. charts in tidal waters use Mean Lower Low Water (MLLW) as the sounding datum. A charted
 * sounding is the depth at that datum, not today's depth. Underlined figures in drying areas are
 * drying heights ABOVE the datum.
 *
 * Always check the chart title block for the units ("SOUNDINGS IN FEET" / "FATHOMS" / "METERS").
 */

export type DepthUnit = 'ft' | 'fm' | 'm';

const FEET_PER: Record<DepthUnit, number> = {
  ft: 1,
  fm: 6, // 1 fathom = 6 feet
  m: 1 / 0.3048, // 1 foot = 0.3048 m exactly
};

export const UNIT_LABEL: Record<DepthUnit, string> = { ft: 'feet', fm: 'fathoms', m: 'metres' };

export function convertDepth(value: number, from: DepthUnit, to: DepthUnit): number {
  return (value * FEET_PER[from]) / FEET_PER[to];
}

/** Approximate water depth now = charted depth + predicted height of tide (same units). */
export function approxDepth(chartedDepth: number, heightOfTide: number): number {
  return chartedDepth + heightOfTide;
}

/**
 * Water over a drying feature (underlined sounding) = height of tide − drying height.
 * Negative means the feature is exposed by that much.
 */
export function waterOverDrying(dryingHeight: number, heightOfTide: number): number {
  return heightOfTide - dryingHeight;
}
