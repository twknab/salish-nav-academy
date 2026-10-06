import {
  angularDifference,
  compassToMagnetic,
  explainTrueToMagnetic,
  formatBearing,
  magneticToCompass,
  magneticToTrue,
  normalize,
  reciprocal,
  signed,
  trueToMagnetic,
} from './bearing';

describe('bearing', () => {
  it('normalizes into [0, 360)', () => {
    expect(normalize(360)).toBe(0);
    expect(normalize(-10)).toBe(350);
    expect(normalize(725)).toBe(5);
    expect(normalize(-0)).toBe(0);
  });

  it('applies the sign convention: East +, West −', () => {
    expect(signed(15, 'E')).toBe(15);
    expect(signed(15, 'W')).toBe(-15);
    expect(signed(-15, 'E')).toBe(15);
  });

  it('matches the brief worked examples', () => {
    expect(trueToMagnetic(270, signed(15, 'E'))).toBe(255);
    expect(trueToMagnetic(270, signed(15, 'W'))).toBe(285);
  });

  it('wraps through north', () => {
    expect(trueToMagnetic(5, 15)).toBe(350);
    expect(magneticToTrue(350, 15)).toBe(5);
    expect(trueToMagnetic(355, -15)).toBe(10);
  });

  it('round-trips', () => {
    for (const t of [0, 1, 90, 179, 180, 270, 359]) {
      for (const v of [-20, -15.5, 0, 15, 20]) {
        expect(magneticToTrue(trueToMagnetic(t, v), v)).toBeCloseTo(t, 9);
      }
    }
  });

  it('handles deviation with the same convention', () => {
    expect(magneticToCompass(255, 3)).toBe(252);
    expect(compassToMagnetic(252, 3)).toBe(255);
  });

  it('formats three-digit bearings', () => {
    expect(formatBearing(5)).toBe('005°');
    expect(formatBearing(359.6)).toBe('000°');
    expect(formatBearing(254.4)).toBe('254°');
  });

  it('explains the arithmetic', () => {
    expect(explainTrueToMagnetic(270, -15)).toBe('270° − (−15°) = 285°');
    expect(explainTrueToMagnetic(5, 15)).toBe('5° − 15° = -10° → normalized to 350°');
  });

  it('computes reciprocals and differences', () => {
    expect(reciprocal(255)).toBe(75);
    expect(angularDifference(355, 5)).toBe(10);
  });
});
