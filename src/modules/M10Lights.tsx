import { useEffect, useState } from 'react';
import { Quiz } from '../components/Quiz';
import { Callout, Section } from '../components/ui';
import { CHARACTER_INFO, COLOR_INFO, type LightSpec, describeLight, illustrativeTimeline, parseLight } from '../lib/nav/lights';
import type { ModuleProps } from './types';

const EXAMPLES = ['Fl R 4s', 'Fl G 4s', 'Q G', 'Iso W 6s', 'Oc R 4s', 'Fl (2) G 6s', 'Mo (A) W', 'Fl W 6s 40ft 9M'];
const LIGHT_HEX: Record<string, string> = { R: '#d83a2f', G: '#2f9a48', W: '#f2d95c', Y: '#e8b600' };

function Timeline({ spec }: { spec: LightSpec }) {
  const segs = illustrativeTimeline(spec);
  const total = segs.reduce((a, s) => a + s.seconds, 0);
  const W = 480;
  let x = 0;
  const color = LIGHT_HEX[spec.colors[0] ?? 'W'];
  return (
    <svg viewBox={`0 0 ${W} 54`} role="img" aria-label="Illustrative on/off pattern for one period">
      <rect x={0} y={6} width={W} height={24} fill="#1b2730" rx={3} />
      {segs.map((s, i) => {
        const w = (s.seconds / total) * W;
        const el = s.on ? <rect key={i} x={x} y={6} width={w} height={24} fill={color} /> : null;
        x += w;
        return el;
      })}
      <text x={0} y={46} fontSize={11} fill="var(--muted)" fontFamily="var(--font-data)">
        0 s
      </text>
      <text x={W} y={46} fontSize={11} fill="var(--muted)" textAnchor="end" fontFamily="var(--font-data)">
        {total} s, then repeats
      </text>
    </svg>
  );
}

function Lamp({ spec }: { spec: LightSpec }) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const id = window.setInterval(() => setT((performance.now() - start) / 1000), 50);
    return () => window.clearInterval(id);
  }, [playing]);
  const segs = illustrativeTimeline(spec);
  const total = segs.reduce((a, s) => a + s.seconds, 0);
  let acc = 0;
  let on = false;
  const phase = t % total;
  for (const s of segs) {
    if (phase >= acc && phase < acc + s.seconds) on = s.on;
    acc += s.seconds;
  }
  const color = LIGHT_HEX[spec.colors[0] ?? 'W'];
  if (reduce) return <p className="chart-caption">Live playback is off because your system asks for reduced motion.</p>;
  return (
    <div className="fields" style={{ alignItems: 'center' }}>
      <svg width={44} height={44} viewBox="0 0 44 44" aria-hidden="true">
        <rect width={44} height={44} rx={8} fill="#1b2730" />
        <circle cx={22} cy={22} r={12} fill={playing && on ? color : '#333d44'} />
      </svg>
      <button type="button" className="btn ghost" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
        {playing ? 'Stop' : 'Watch it at real speed'}
      </button>
    </div>
  );
}

function Decoder() {
  const [txt, setTxt] = useState('Fl R 4s');
  const spec = parseLight(txt);
  return (
    <div className="panel">
      <div className="panel-title">Light decoder</div>
      <div className="legend">
        {EXAMPLES.map((e) => (
          <button key={e} type="button" className="chip" aria-pressed={txt === e} onClick={() => setTxt(e)}>
            {e}
          </button>
        ))}
      </div>
      <label className="field" htmlFor="ld-in">
        Or type a characteristic
        <input id="ld-in" className="wide" value={txt} onChange={(e) => setTxt(e.target.value)} />
      </label>
      {spec ? (
        <div className="result" aria-live="polite">
          <div className="table-wrap">
            <table>
              <tbody>
                <tr>
                  <th scope="row">Character</th>
                  <td className="data">
                    {spec.character}
                    {spec.group ? ` (${spec.group})` : ''}
                  </td>
                  <td>
                    <strong>{CHARACTER_INFO[spec.character].name}</strong>. {CHARACTER_INFO[spec.character].meaning}
                    {spec.group && spec.character !== 'Mo' ? ` In groups of ${spec.group}.` : ''}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Colour</th>
                  <td className="data">{spec.colors.join('')}</td>
                  <td>
                    {spec.colors.map((c) => COLOR_INFO[c]).join(' / ')}
                    {txt.match(/\b[WRGY]\b/) ? '' : ' (no letter printed means white)'}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Period</th>
                  <td className="data">{spec.periodSeconds ? `${spec.periodSeconds}s` : '—'}</td>
                  <td>{spec.periodSeconds ? 'Time for one full cycle, start of one pattern to the start of the next. Time it with a watch.' : 'Not printed.'}</td>
                </tr>
                {spec.heightFeet ? (
                  <tr>
                    <th scope="row">Height</th>
                    <td className="data">{spec.heightFeet}ft</td>
                    <td>Height of the light above the chart&apos;s height datum.</td>
                  </tr>
                ) : null}
                {spec.rangeNm ? (
                  <tr>
                    <th scope="row">Range</th>
                    <td className="data">{spec.rangeNm}M</td>
                    <td>Nominal range in nautical miles in clear weather. From a kayak&apos;s low eye height, you may see it later.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p>
            <strong>In words:</strong> {describeLight(spec)}
          </p>
          <Timeline spec={spec} />
          <p className="chart-caption">Flash lengths here are illustrative. The chart gives only the pattern and period. Exact timing is in the Light List.</p>
          <Lamp spec={spec} />
        </div>
      ) : (
        <p className="err">Could not read that. Try the form &quot;Fl R 4s&quot;: character, colour, then period.</p>
      )}
    </div>
  );
}

export default function M10Lights({ onScore }: ModuleProps) {
  return (
    <>
      <Section title="Reading a light label">
        <Decoder />
      </Section>
      <Section title="U.S. lateral aids: understand the system">
        <div className="two-col">
          <div className="prose">
            <p>
              U.S. waters use the IALA <strong>Region B</strong> system. Lateral aids mark the sides of a channel for a vessel{' '}
              <em>returning from sea</em>:
            </p>
            <ul>
              <li>
                <strong>Red</strong> aids (even numbers, cone-shaped &quot;nun&quot; buoys, triangular daybeacons, red lights) are on your{' '}
                <strong>starboard (right)</strong> side.
              </li>
              <li>
                <strong>Green</strong> aids (odd numbers, can buoys, square daybeacons, green lights) are on your <strong>port (left)</strong>{' '}
                side.
              </li>
              <li>Numbers increase as you head in from sea.</li>
              <li>
                Other aids: safe-water marks (red and white vertical stripes, often Mo (A) W) and isolated-danger marks (black with red bands,
                Fl (2) W) mean something different. Learn them separately.
              </li>
            </ul>
          </div>
          <Callout kind="warn" title="Why not just “red right returning”?">
            <p>
              &quot;Returning&quot; depends on a defined direction. In inland waters like Puget Sound, the direction of buoyage is set per
              waterway and given in the Light List and Coast Pilot. Heading the &quot;wrong&quot; way flips the rule.
            </p>
            <p style={{ marginTop: 6 }}>
              For a kayaker, the better questions are: <em>what hazard does this aid mark, which side of it is the deep water, and where
              will the big boats be?</em> Channels are drawn for deep-draft vessels. A kayak is often safest outside them, in water too
              shallow for the traffic.
            </p>
          </Callout>
        </div>
      </Section>
      <Quiz
        onScore={onScore}
        questions={[
          {
            q: '"Fl G 4s" means…',
            options: ['Fixed green, 4 miles', 'Flashing green, one flash every 4 seconds', 'Four green flashes', 'Green flag, 4 metres'],
            answer: 1,
            why: 'Fl = flashing, G = green, 4s = period.',
          },
          {
            q: 'A light is on longer than it is off, with brief eclipses. Its abbreviation?',
            options: ['Fl', 'Iso', 'Oc', 'Q'],
            answer: 2,
            why: 'Occulting: the light lasts longer than the dark.',
          },
          {
            q: 'In U.S. waters, an even-numbered red nun buoy, when returning from sea, is passed…',
            options: ['On your port side', 'On your starboard side', 'Either side', 'Never'],
            answer: 1,
            why: 'Region B: red right returning, but only once you know which direction counts as "returning".',
          },
        ]}
      />
    </>
  );
}
