import { describeLight, illustrativeTimeline, parseLight } from './lights';

describe('lights', () => {
  it('parses Fl R 4s', () => {
    expect(parseLight('Fl R 4s')).toEqual({
      character: 'Fl',
      group: null,
      colors: ['R'],
      periodSeconds: 4,
      heightFeet: null,
      rangeNm: null,
    });
  });

  it('parses groups, height and range', () => {
    const l = parseLight('Fl (2) G 6s 15ft 4M');
    expect(l).toMatchObject({ character: 'Fl', group: '2', colors: ['G'], periodSeconds: 6, heightFeet: 15, rangeNm: 4 });
  });

  it('distinguishes look-alike prefixes', () => {
    expect(parseLight('VQ G')?.character).toBe('VQ');
    expect(parseLight('LFl W 10s')?.character).toBe('LFl');
    expect(parseLight('Iso W 6s')?.character).toBe('Iso');
    expect(parseLight('Mo (A) W')).toMatchObject({ character: 'Mo', group: 'A' });
  });

  it('defaults to white when no colour is given', () => {
    expect(parseLight('Fl 4s')?.colors).toEqual(['W']);
  });

  it('rejects unknown notation', () => {
    expect(parseLight('Blink R 4s')).toBeNull();
    expect(parseLight('Fl R 4s banana')).toBeNull();
  });

  it('builds a timeline whose length equals the period', () => {
    for (const s of ['Fl R 4s', 'Fl (2) G 6s', 'Iso W 6s', 'Oc R 4s', 'Q G', 'F R']) {
      const spec = parseLight(s)!;
      const total = illustrativeTimeline(spec).reduce((a, seg) => a + seg.seconds, 0);
      const expected = spec.periodSeconds ?? (spec.character === 'Q' ? 1 : 4);
      expect(total).toBeCloseTo(expected, 6);
    }
  });

  it('describes in words', () => {
    expect(describeLight(parseLight('Fl R 4s')!)).toBe('Flashing, red, repeating every 4 seconds.');
  });
});
