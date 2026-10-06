import { formatDDM, fromDDM, parseDDM, toDDM } from './coords';

describe('coords', () => {
  it('converts decimal to DDM', () => {
    expect(toDDM(47.52, 'lat')).toMatchObject({ degrees: 47, hemisphere: 'N' });
    expect(toDDM(47.52, 'lat').minutes).toBeCloseTo(31.2, 6);
    expect(toDDM(-122.475, 'lon')).toMatchObject({ degrees: 122, hemisphere: 'W' });
  });

  it('formats with padding', () => {
    expect(formatDDM(47.52, 'lat')).toBe('47°31.20′ N');
    expect(formatDDM(-122.475, 'lon')).toBe('122°28.50′ W');
    expect(formatDDM(47.999999, 'lat', 1)).toBe('48°00.0′ N');
  });

  it('round-trips fromDDM', () => {
    expect(fromDDM(122, 28.5, 'W')).toBeCloseTo(-122.475, 9);
  });

  it('parses common inputs', () => {
    expect(parseDDM('47 31.2 N', 'lat')).toBeCloseTo(47.52, 9);
    expect(parseDDM("47°31.20'N", 'lat')).toBeCloseTo(47.52, 9);
    expect(parseDDM('122° 28.5′ W', 'lon')).toBeCloseTo(-122.475, 9);
    expect(parseDDM('-122 28.5', 'lon')).toBeCloseTo(-122.475, 9);
  });

  it('rejects nonsense', () => {
    expect(parseDDM('47 61 N', 'lat')).toBeNull();
    expect(parseDDM('47 30 W', 'lat')).toBeNull();
    expect(parseDDM('95 00 N', 'lat')).toBeNull();
    expect(parseDDM('hello', 'lat')).toBeNull();
  });
});
