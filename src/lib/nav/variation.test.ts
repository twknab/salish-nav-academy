import { formatVariation, fromSignedMinutes, minutesToDegrees, toSignedMinutes, updateVariation } from './variation';

describe('variation', () => {
  const rose = toSignedMinutes(15, 0, 'E'); // fictional VAR 15°00′E (2025)
  const annual = toSignedMinutes(0, 6, 'W'); // ANNUAL CHANGE 6′W

  it('encodes the fictional rose', () => {
    expect(rose).toBe(900);
    expect(annual).toBe(-6);
  });

  it('updates forward: 5 years × 6′W = 30′ less easterly', () => {
    expect(formatVariation(updateVariation(rose, annual, 2025, 2030))).toBe('14°30′ E');
  });

  it('updates across 10 years to a whole degree change', () => {
    expect(formatVariation(updateVariation(rose, annual, 2025, 2035))).toBe('14°00′ E');
  });

  it('runs backwards for earlier years', () => {
    expect(formatVariation(updateVariation(rose, annual, 2025, 2015))).toBe('16°00′ E');
  });

  it('crosses zero from East to West', () => {
    const small = toSignedMinutes(0, 10, 'E');
    expect(formatVariation(updateVariation(small, -6, 2020, 2022))).toBe('0°02′ W');
    expect(fromSignedMinutes(0).dir).toBeNull();
  });

  it('converts to signed degrees', () => {
    expect(minutesToDegrees(870)).toBe(14.5);
  });
});
