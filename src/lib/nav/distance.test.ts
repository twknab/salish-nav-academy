import { courseAndDistance, legDistance, lonMinuteNm, nmToKm, nmToStatuteMiles, transitMinutes } from './distance';

describe('distance', () => {
  it('uses exact unit definitions', () => {
    expect(nmToKm(1)).toBe(1.852);
    expect(nmToStatuteMiles(1)).toBeCloseTo(1.1508, 4);
  });

  it('gives ≈0.68 NM per minute of longitude at 47.5° N', () => {
    expect(lonMinuteNm(47.5)).toBeCloseTo(0.6756, 3);
    expect(lonMinuteNm(0)).toBe(1);
    expect(lonMinuteNm(90)).toBeCloseTo(0, 9);
  });

  it('splits a leg into N/S and E/W components', () => {
    const d = legDistance(47.5, 1, 1);
    expect(d.northSouthNm).toBe(1);
    expect(d.eastWestNm).toBeCloseTo(0.68, 2);
    expect(d.totalNm).toBeCloseTo(1.21, 2);
  });

  it('treats negative deltas as magnitudes', () => {
    expect(legDistance(47.5, -3, 0).totalNm).toBe(3);
  });

  it('computes course and distance for due north and due east legs', () => {
    const north = courseAndDistance({ lat: 47.5, lon: -122.5 }, { lat: 47.55, lon: -122.5 });
    expect(north.distanceNm).toBeCloseTo(3, 6);
    expect(north.trueCourse).toBeCloseTo(0, 6);
    const east = courseAndDistance({ lat: 47.5, lon: -122.5 }, { lat: 47.5, lon: -122.45 });
    expect(east.trueCourse).toBeCloseTo(90, 6);
    expect(east.distanceNm).toBeCloseTo(3 * 0.6756, 3);
  });

  it('computes transit time', () => {
    expect(transitMinutes(3, 3)).toBe(60);
    expect(transitMinutes(1, 0)).toBe(Infinity);
  });
});
