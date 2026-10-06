/**
 * Light characteristics as abbreviated on U.S. charts (per U.S. Chart No. 1, section P), e.g.
 *   "Fl R 4s"  "Q G"  "Iso W 6s"  "Oc R 4s"  "Fl (2) G 6s"  "Mo (A) W"  "Fl G 4s 15ft 4M"
 */

export type LightCharacter = 'F' | 'Fl' | 'LFl' | 'Q' | 'VQ' | 'Iso' | 'Oc' | 'Mo';
export type LightColor = 'W' | 'R' | 'G' | 'Y';

export interface LightSpec {
  character: LightCharacter;
  group: string | null; // "2" for Fl (2); "A" for Mo (A)
  colors: LightColor[];
  periodSeconds: number | null;
  heightFeet: number | null;
  rangeNm: number | null;
}

export const CHARACTER_INFO: Record<LightCharacter, { name: string; meaning: string }> = {
  F: { name: 'Fixed', meaning: 'A continuous, steady light.' },
  Fl: {
    name: 'Flashing',
    meaning: 'Each flash is shorter than the dark between flashes; fewer than 30 flashes a minute.',
  },
  LFl: { name: 'Long-flashing', meaning: 'A flash of at least 2 seconds, still shorter than the dark.' },
  Q: { name: 'Quick', meaning: 'Rapid flashes — 50 to 79 per minute, usually 60.' },
  VQ: { name: 'Very quick', meaning: 'Very rapid flashes — 80 to 159 per minute, usually 100 or 120.' },
  Iso: { name: 'Isophase', meaning: 'Light and dark of exactly equal length.' },
  Oc: { name: 'Occulting', meaning: 'Mostly on, briefly eclipsed — the light lasts longer than the dark.' },
  Mo: { name: 'Morse code', meaning: 'Flashes that spell a Morse letter, e.g. Mo (A) = short-long.' },
};

export const COLOR_INFO: Record<LightColor, string> = {
  W: 'white',
  R: 'red',
  G: 'green',
  Y: 'yellow',
};

const CHARACTERS: LightCharacter[] = ['LFl', 'VQ', 'Iso', 'Fl', 'Oc', 'Mo', 'Q', 'F'];

export function parseLight(input: string): LightSpec | null {
  let s = input.trim().replace(/\s+/g, ' ');
  const character = CHARACTERS.find((c) => s.startsWith(c));
  if (!character) return null;
  s = s.slice(character.length).trim();

  let group: string | null = null;
  const g = s.match(/^\(\s*([0-9A-Z+]+)\s*\)/);
  if (g) {
    group = g[1] ?? null;
    s = s.slice(g[0].length).trim();
  }

  const colors: LightColor[] = [];
  const c = s.match(/^([WRGY]+)\b/);
  if (c && c[1]) {
    for (const ch of c[1]) colors.push(ch as LightColor);
    s = s.slice(c[0].length).trim();
  }

  const period = s.match(/(\d+(?:\.\d+)?)\s*s\b/);
  const height = s.match(/(\d+(?:\.\d+)?)\s*ft\b/);
  const range = s.match(/(\d+(?:\.\d+)?)\s*M\b/);
  const rest = s
    .replace(period?.[0] ?? '\u0000', '')
    .replace(height?.[0] ?? '\u0000', '')
    .replace(range?.[0] ?? '\u0000', '')
    .trim();
  if (rest.length > 0) return null;

  return {
    character,
    group,
    colors: colors.length ? colors : ['W'], // no colour letter means white
    periodSeconds: period ? Number(period[1]) : null,
    heightFeet: height ? Number(height[1]) : null,
    rangeNm: range ? Number(range[1]) : null,
  };
}

export interface Segment {
  on: boolean;
  seconds: number;
}

/**
 * An ILLUSTRATIVE on/off timeline for one period. Real flash durations are set per aid in the
 * Light List; only the character and period are on the chart.
 */
export function illustrativeTimeline(spec: LightSpec): Segment[] {
  const period = spec.periodSeconds ?? (spec.character === 'Q' ? 1 : spec.character === 'VQ' ? 0.5 : 4);
  const flashes = spec.group && /^\d+$/.test(spec.group) ? Number(spec.group) : 1;
  switch (spec.character) {
    case 'F':
      return [{ on: true, seconds: period }];
    case 'Iso':
      return [
        { on: true, seconds: period / 2 },
        { on: false, seconds: period / 2 },
      ];
    case 'Oc': {
      const out: Segment[] = [];
      const eclipse = Math.min(1, period * 0.2);
      const lit = (period - eclipse * flashes) / flashes;
      for (let i = 0; i < flashes; i++) out.push({ on: true, seconds: lit }, { on: false, seconds: eclipse });
      return out;
    }
    case 'Q':
    case 'VQ':
      return [
        { on: true, seconds: period * 0.3 },
        { on: false, seconds: period * 0.7 },
      ];
    case 'Mo':
      // Mo (A): short, long, then a long dark.
      return [
        { on: true, seconds: 0.4 },
        { on: false, seconds: 0.6 },
        { on: true, seconds: 1.5 },
        { on: false, seconds: Math.max(1, period - 2.5) },
      ];
    case 'LFl':
      return [
        { on: true, seconds: 2 },
        { on: false, seconds: Math.max(2.5, period - 2) },
      ];
    case 'Fl':
    default: {
      const flash = 0.5;
      const gap = 1;
      const out: Segment[] = [];
      for (let i = 0; i < flashes; i++) {
        out.push({ on: true, seconds: flash });
        if (i < flashes - 1) out.push({ on: false, seconds: gap });
      }
      const used = flashes * flash + (flashes - 1) * gap;
      out.push({ on: false, seconds: Math.max(0.5, period - used) });
      return out;
    }
  }
}

export function describeLight(spec: LightSpec): string {
  const info = CHARACTER_INFO[spec.character];
  const groupTxt = spec.group
    ? spec.character === 'Mo'
      ? ` of the letter ${spec.group}`
      : ` in groups of ${spec.group}`
    : '';
  const colorTxt = spec.colors.map((c) => COLOR_INFO[c]).join(' / ');
  const periodTxt = spec.periodSeconds
    ? `, repeating every ${spec.periodSeconds} second${spec.periodSeconds === 1 ? '' : 's'}`
    : '';
  return `${info.name}${groupTxt}, ${colorTxt}${periodTxt}.`;
}
