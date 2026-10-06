import { approxDepth, convertDepth, waterOverDrying } from './depth';

describe('depth', () => {
  it('converts units', () => {
    expect(convertDepth(1, 'fm', 'ft')).toBe(6);
    expect(convertDepth(12, 'ft', 'fm')).toBe(2);
    expect(convertDepth(10, 'm', 'ft')).toBeCloseTo(32.808, 3);
    expect(convertDepth(6, 'ft', 'm')).toBeCloseTo(1.8288, 4);
  });

  it('adds height of tide to a charted sounding', () => {
    expect(approxDepth(4, 7.5)).toBe(11.5);
    expect(approxDepth(4, -2)).toBe(2); // a minus tide is shallower than charted
  });

  it('computes water over a drying height', () => {
    expect(waterOverDrying(3, 7)).toBe(4);
    expect(waterOverDrying(3, 1)).toBe(-2);
  });
});
