import { useState } from 'react';
import { Quiz } from '../components/Quiz';
import { Callout, NumField, Panel, Section, Seg, num } from '../components/ui';
import { type EastWest, compassToMagnetic, formatBearing, magneticToCompass, signed, trueToMagnetic } from '../lib/nav/bearing';
import type { ModuleProps } from './types';

function Chain() {
  const box = (y: number, label: string, sub: string) => (
    <g>
      <rect x={70} y={y} width={180} height={44} rx={6} fill="var(--sheet)" stroke="var(--rule)" />
      <text x={160} y={y + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--fg)" fontFamily="var(--font-display)">
        {label}
      </text>
      <text x={160} y={y + 35} textAnchor="middle" fontSize={10} fill="var(--muted)">
        {sub}
      </text>
    </g>
  );
  const arrow = (y: number, label: string) => (
    <g>
      <line x1={160} y1={y} x2={160} y2={y + 26} stroke="var(--accent)" strokeWidth={2} />
      <path d={`M154,${y + 20} L160,${y + 30} L166,${y + 20}`} fill="none" stroke="var(--accent)" strokeWidth={2} />
      <text x={176} y={y + 18} fontSize={11} fill="var(--accent)" fontWeight={600}>
        {label}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="True, minus variation, gives Magnetic; minus deviation gives Compass">
      {box(6, 'TRUE', 'what you measure on the chart')}
      {arrow(52, '− variation (E +, W −)')}
      {box(86, 'MAGNETIC', 'what a perfect compass reads')}
      {arrow(132, '− deviation (E +, W −)')}
      {box(166, 'COMPASS', 'what YOUR compass reads')}
    </svg>
  );
}

function DeviationCalc() {
  const [t, setT] = useState('070');
  const [v, setV] = useState('15');
  const [vd, setVd] = useState<EastWest>('E');
  const [d, setD] = useState('3');
  const [dd, setDd] = useState<EastWest>('W');
  const tt = num(t);
  const vv = num(v);
  const ddv = num(d);
  const ok = tt !== null && vv !== null && ddv !== null;
  const mag = ok ? trueToMagnetic(tt, signed(vv, vd)) : 0;
  const comp = ok ? magneticToCompass(mag, signed(ddv, dd)) : 0;
  return (
    <Panel title="Full chain: true → magnetic → compass">
      <div className="fields">
        <NumField id="dv-t" label="True course (°)" value={t} onChange={setT} />
        <NumField id="dv-v" label="Variation (°)" value={v} onChange={setV} />
        <Seg label="Var" value={vd} onChange={setVd} options={[{ v: 'E', label: 'E' }, { v: 'W', label: 'W' }]} />
        <NumField id="dv-d" label="Deviation (°)" value={d} onChange={setD} />
        <Seg label="Dev" value={dd} onChange={setDd} options={[{ v: 'E', label: 'E' }, { v: 'W', label: 'W' }]} />
      </div>
      {ok ? (
        <div className="result" aria-live="polite">
          <dl className="kv">
            <dt>Magnetic</dt>
            <dd>{formatBearing(mag)}</dd>
            <dt>Compass (steer)</dt>
            <dd>
              <span className="big">{formatBearing(comp)}</span>
            </dd>
            <dt>Check back</dt>
            <dd>{formatBearing(compassToMagnetic(comp, signed(ddv, dd)))} magnetic</dd>
          </dl>
        </div>
      ) : (
        <p className="err">Enter all three numbers.</p>
      )}
    </Panel>
  );
}

export default function M06Deviation({ onScore }: ModuleProps) {
  return (
    <>
      <Section title="Two different errors">
        <div className="two-col">
          <div className="prose">
            <p>
              <strong>Variation</strong> is the Earth&apos;s doing: the angle between true north and magnetic north where you are. It is the
              same for everyone in that place and year, and it is printed on the chart.
            </p>
            <p>
              <strong>Deviation</strong> is your boat&apos;s doing: the error your own compass picks up from nearby iron, magnets and
              electronics. It is different for every boat, can change with heading, and is not on any chart.
            </p>
            <p>
              Most sea kayakers work only <strong>True ↔ Magnetic</strong>. A well-placed deck compass on a kayak usually has negligible
              deviation. Add deviation to the chain only if you have measured a meaningful error, or if your setup changes.
            </p>
          </div>
          <div className="chart-frame">
            <Chain />
          </div>
        </div>
      </Section>

      <Section title="Deviation sources on a kayak">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>What to do</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Deck compass placement', 'Mount it on the centreline, away from deck fittings with steel screws, and where you can see it without turning your head.'],
                ['Phone in a deck bag or PFD pocket', 'Phones contain magnets (speakers) and electronics. Keep them well away from the compass.'],
                ['Watches', 'Smartwatches and some steel watches deflect a hand-bearing compass held close to your wrist.'],
                ['Speakers / radios', 'Speaker magnets are strong. A VHF on the foredeck can swing a compass many degrees.'],
                ['Knives and tools', 'A steel knife on the PFD or under the deck lines near the compass can cause error.'],
                ['Magnetic clasps', 'Hatch covers, deck bags, PFD pockets and map cases with magnetic closures are a classic culprit.'],
                ['Batteries and electronics', 'Lights, GPS units and pumps draw current, and current makes a magnetic field.'],
              ].map(([a, b]) => (
                <tr key={a}>
                  <td>
                    <strong>{a}</strong>
                  </td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout title="Test after you load the boat">
          With all your usual gear in place, point the kayak at a distant object whose magnetic bearing you know: take a hand-bearing compass
          reading well away from the boat, or line up two charted objects whose true bearing you can convert. Compare it with the deck compass.
          Repeat on a few headings. Then move each suspect item and watch whether the needle moves.
        </Callout>
      </Section>

      <Section title="When deviation matters">
        <DeviationCalc />
      </Section>

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'Which error is printed on the chart?',
            options: ['Deviation', 'Variation', 'Both', 'Neither'],
            answer: 1,
            why: 'Variation is a property of place and year. Deviation belongs to your boat.',
          },
          {
            q: 'Your compass swings 8° when you put your phone in the day hatch under it. That is…',
            options: ['Variation', 'Deviation', 'Normal and safe to ignore', 'A broken compass'],
            answer: 1,
            why: 'A local magnetic disturbance from your gear is deviation. Move the phone.',
          },
        ]}
      />
    </>
  );
}
