import { courseAndDistance } from '../lib/nav/distance';
import { POINTS, fromLatLon, toLatLon } from './model';

describe('training chart model', () => {
  it('round-trips chart coordinates through lat/lon', () => {
    const [x, y] = fromLatLon(toLatLon(POINTS.B));
    expect(x).toBeCloseTo(POINTS.B[0], 9);
    expect(y).toBeCloseTo(POINTS.B[1], 9);
  });

  it('keeps the final-exercise crossing near the 3 NM the brief asks for', () => {
    const { distanceNm, trueCourse } = courseAndDistance(toLatLon(POINTS.A), toLatLon(POINTS.B));
    expect(distanceNm).toBeGreaterThan(2.7);
    expect(distanceNm).toBeLessThan(3.2);
    expect(trueCourse).toBeGreaterThan(60);
    expect(trueCourse).toBeLessThan(80);
  });
});
