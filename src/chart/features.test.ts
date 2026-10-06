import { FEATURES, FEATURE_GROUPS } from './features';

describe('feature dictionary', () => {
  it('covers every feature the brief lists for section 1', () => {
    const ids = new Set(FEATURES.map((f) => f.id));
    for (const id of [
      'colors', 'shoreline', 'soundings', 'contours', 'drying', 'rock-sunken', 'rock-drying', 'reef', 'shoal', 'wreck', 'kelp',
      'buoy', 'daybeacon', 'light', 'lighthouse', 'range', 'landmark', 'bridge', 'cable', 'restricted', 'anchorage', 'ferry',
      'tss', 'separation-zone', 'rose', 'grid', 'datum', 'scale', 'notes',
    ]) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it('gives every feature all three explanations', () => {
    for (const f of FEATURES) {
      expect(f.means.length, f.id).toBeGreaterThan(10);
      expect(f.looks.length, f.id).toBeGreaterThan(10);
      expect(f.why.length, f.id).toBeGreaterThan(10);
      expect(FEATURE_GROUPS).toContain(f.group);
    }
  });

  it('has unique ids', () => {
    expect(new Set(FEATURES.map((f) => f.id)).size).toBe(FEATURES.length);
  });
});
