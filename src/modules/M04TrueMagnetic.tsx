import { useState } from 'react';
import { CompassRose } from '../chart/ChartView';
import { Quiz } from '../components/Quiz';
import { Callout, NumField, Panel, Section, Seg, Varies, num } from '../components/ui';
import {
  type EastWest,
  explainMagneticToTrue,
  explainTrueToMagnetic,
  formatBearing,
  magneticToTrue,
  signed,
  trueToMagnetic,
} from '../lib/nav/bearing';
import { formatVariation, minutesToDegrees, toSignedMinutes, updateVariation } from '../lib/nav/variation';
import { THIS_YEAR, type ModuleProps } from './types';

function RoseDiagram() {
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label="Fictional compass rose. Outer ring is true, inner ring is magnetic, rotated 15 degrees east.">
      <rect width={300} height={300} fill="var(--c-deep)" />
      <CompassRose cx={150} cy={152} r={118} />
      <g fontSize={10} fontFamily="var(--font-body)" fill="var(--c-ink)">
        <text x={150} y={14} textAnchor="middle" fontWeight={700}>
          True north (outer ring 000°)
        </text>
        <text x={226} y={60}>Magnetic</text>
        <text x={226} y={72}>north</text>
      </g>
    </svg>
  );
}

export function UpdateRoseCalc({ idPrefix, initial }: { idPrefix: string; initial: { deg: string; min: string; dir: EastWest; year: string; ann: string; annDir: EastWest } }) {
  const [deg, setDeg] = useState(initial.deg);
  const [min, setMin] = useState(initial.min);
  const [dir, setDir] = useState<EastWest>(initial.dir);
  const [year, setYear] = useState(initial.year);
  const [ann, setAnn] = useState(initial.ann);
  const [annDir, setAnnDir] = useState<EastWest>(initial.annDir);
  const [target, setTarget] = useState(String(THIS_YEAR));
  const d = num(deg);
  const m = num(min);
  const y = num(year);
  const a = num(ann);
  const t = num(target);
  const ok = d !== null && m !== null && y !== null && a !== null && t !== null && m >= 0 && m < 60;
  const base = ok ? toSignedMinutes(d, m, dir) : 0;
  const change = ok ? toSignedMinutes(0, a, annDir) : 0;
  const years = ok ? t - y : 0;
  const result = ok ? updateVariation(base, change, y, t) : 0;
  return (
    <Panel title="Update a compass rose to a later year">
      <div className="fields">
        <NumField id={`${idPrefix}-deg`} label="VAR degrees" value={deg} onChange={setDeg} />
        <NumField id={`${idPrefix}-min`} label="minutes" value={min} onChange={setMin} />
        <Seg label="Direction" value={dir} onChange={setDir} options={[{ v: 'E', label: 'E' }, { v: 'W', label: 'W' }]} />
        <NumField id={`${idPrefix}-year`} label="Rose year" value={year} onChange={setYear} />
      </div>
      <div className="fields">
        <NumField id={`${idPrefix}-ann`} label="Annual change (′)" value={ann} onChange={setAnn} />
        <Seg label="Change direction" value={annDir} onChange={setAnnDir} options={[{ v: 'E', label: 'E' }, { v: 'W', label: 'W' }]} />
        <NumField id={`${idPrefix}-target`} label="Year you are paddling" value={target} onChange={setTarget} />
      </div>
      {ok ? (
        <div className="result" aria-live="polite">
          <div className="big">{formatVariation(result)}</div>
          <div className="work">
            {base} ′ {change < 0 ? '−' : '+'} {Math.abs(change)}′/yr × {years} yr = {result}′ → ÷ 60 = {formatVariation(result)} ={' '}
            {minutesToDegrees(result).toFixed(2)}° (signed: E +, W −)
          </div>
          {Math.abs(years) > 10 ? (
            <p className="err">
              That is more than 10 years from the rose. The annual change itself drifts, so check a current geomagnetic calculator.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="err">Fill in every field. Minutes must be 0–59.</p>
      )}
    </Panel>
  );
}

export function BearingCalc({ idPrefix, initialVar = '15', initialDir = 'E' as EastWest }: { idPrefix: string; initialVar?: string; initialDir?: EastWest }) {
  const [mode, setMode] = useState<'T2M' | 'M2T'>('T2M');
  const [bearing, setBearing] = useState('270');
  const [v, setV] = useState(initialVar);
  const [dir, setDir] = useState<EastWest>(initialDir);
  const b = num(bearing);
  const vv = num(v);
  const ok = b !== null && vv !== null;
  const signedVar = ok ? signed(vv, dir) : 0;
  return (
    <Panel title="True ↔ magnetic calculator">
      <div className="fields">
        <Seg
          label="Convert"
          value={mode}
          onChange={setMode}
          options={[
            { v: 'T2M', label: 'True → Magnetic' },
            { v: 'M2T', label: 'Magnetic → True' },
          ]}
        />
      </div>
      <div className="fields">
        <NumField id={`${idPrefix}-b`} label={mode === 'T2M' ? 'True bearing (°)' : 'Magnetic bearing (°)'} value={bearing} onChange={setBearing} />
        <NumField id={`${idPrefix}-v`} label="Variation (°)" value={v} onChange={setV} />
        <Seg label="Variation is" value={dir} onChange={setDir} options={[{ v: 'E', label: 'East (+)' }, { v: 'W', label: 'West (−)' }]} />
      </div>
      {ok ? (
        <div className="result" aria-live="polite">
          <div>
            <span className="big">{formatBearing(mode === 'T2M' ? trueToMagnetic(b, signedVar) : magneticToTrue(b, signedVar))}</span>{' '}
            <span style={{ color: 'var(--muted)' }}>{mode === 'T2M' ? 'magnetic' : 'true'}</span>
          </div>
          <div className="work">
            {mode === 'T2M' ? 'Magnetic = True − Variation: ' : 'True = Magnetic + Variation: '}
            {mode === 'T2M' ? explainTrueToMagnetic(b, signedVar) : explainMagneticToTrue(b, signedVar)}
          </div>
        </div>
      ) : (
        <p className="err">Enter a bearing and a variation.</p>
      )}
    </Panel>
  );
}

export default function M04TrueMagnetic({ onScore }: ModuleProps) {
  return (
    <>
      <Section title="Two norths">
        <div className="two-col">
          <div className="prose">
            <p>
              <strong>True north</strong> is the direction to the geographic North Pole, the axis the Earth spins on. Every meridian on a
              chart runs true north–south, so courses you <em>measure on a chart</em> are true.
            </p>
            <p>
              <strong>Magnetic north</strong> is where a compass needle points: along the local direction of the Earth&apos;s magnetic
              field. That field comes from moving molten iron in the outer core. It is lumpy, it does not line up with the spin axis, and it
              slowly changes.
            </p>
            <p>
              <strong>Magnetic variation</strong> (also called <em>declination</em>) is the angle between the two at a given place and time.
              East variation means the compass points east of true north. West means it points west of true north.
            </p>
            <ul>
              <li>
                <strong>It changes with place</strong> because the field is irregular. Lines of equal variation wander across the map rather
                than running neatly north–south.
              </li>
              <li>
                <strong>It changes with time</strong> because the core&apos;s flow changes. This &quot;secular variation&quot; is why a rose
                prints a year and an annual change.
              </li>
            </ul>
          </div>
          <div className="chart-frame">
            <RoseDiagram />
          </div>
        </div>
        <Callout title="Reading the two rings">
          The <strong>outer ring</strong> is true: its 000° points at true north. The <strong>inner ring</strong> is magnetic: its 000° points
          to magnetic north and is turned by the variation. Here that is 15° clockwise, because the variation is East. The middle prints{' '}
          <span className="data">VAR 15°00′E (2025) ANNUAL CHANGE 6′W</span>: the variation in 2025, and how much it changes each year.
        </Callout>
        <Varies>
          This rose is <strong>fictional</strong>. Read the variation from <em>your</em> chart&apos;s rose nearest your route, or from a
          current geomagnetic calculator.
        </Varies>
      </Section>

      <Section title="Updating the rose to this year">
        <div className="prose">
          <p>
            Work in minutes, because the annual change is printed in minutes, and <span className="data">60′ = 1°</span>. Signs: East is +,
            West is −.
          </p>
          <p className="work">
            15°00′E (2025) = +900′. Annual change 6′W = −6′/yr. In 2030: 900 − 6 × 5 = 870′ = 14°30′E.
          </p>
          <p>
            A westerly annual change on an easterly variation makes it <em>less</em> easterly over time. That trend is expected around the
            Pacific Northwest today, but read it from your chart rather than assuming it.
          </p>
        </div>
        <UpdateRoseCalc idPrefix="u4" initial={{ deg: '15', min: '0', dir: 'E', year: '2025', ann: '6', annDir: 'W' }} />
      </Section>

      <Section title="Converting with signed numbers">
        <div className="prose">
          <p>Skip the mnemonics and use one convention that always works:</p>
          <p className="formula">East variation = positive · West variation = negative</p>
          <p className="formula">Magnetic = True − Variation</p>
          <p className="formula">True = Magnetic + Variation</p>
          <p>Then normalize to 000°–359° by adding or subtracting 360°.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Variation</th>
                <th>True</th>
                <th>Working</th>
                <th>Magnetic</th>
              </tr>
            </thead>
            <tbody>
              {[
                [15, 'E', 270],
                [15, 'W', 270],
                [15, 'E', 5],
                [15, 'W', 355],
              ].map(([vv, d, t]) => {
                const s = signed(vv as number, d as EastWest);
                return (
                  <tr key={`${vv}${d}${t}`}>
                    <td className="data">
                      {vv}° {d} ({s > 0 ? '+' : '−'}
                      {Math.abs(s)})
                    </td>
                    <td className="data">{formatBearing(t as number)}</td>
                    <td className="data">{explainTrueToMagnetic(t as number, s)}</td>
                    <td className="data">
                      <strong>{formatBearing(trueToMagnetic(t as number, s))}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <BearingCalc idPrefix="b4" />
        <Callout title="Sanity check">
          With East variation the magnetic number is <em>smaller</em> than the true one. With West it is <em>larger</em>. The old rhymes
          (&quot;east is least, west is best&quot;) say the same thing for True → Magnetic only. The signed rule works in both directions.
        </Callout>
      </Section>

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'The chart rose says VAR 16°E. You measure a true course of 090°. What do you steer by compass (ignoring deviation)?',
            options: ['106°', '074°', '090°', '254°'],
            answer: 1,
            why: 'Magnetic = 090 − (+16) = 074°.',
          },
          {
            q: 'Variation 12° W. You take a magnetic bearing of 350° to a lighthouse. What true bearing do you plot?',
            options: ['002°', '338°', '358°', '350°'],
            answer: 1,
            why: 'True = 350 + (−12) = 338°.',
          },
          {
            q: 'Variation 15° E. True course 008°. Magnetic course?',
            options: ['023°', '353°', '−007°', '008°'],
            answer: 1,
            why: '8 − 15 = −7 → +360 = 353°.',
          },
          {
            q: 'A rose reads VAR 15°00′E (2025), ANNUAL CHANGE 6′W. What is the variation in 2035?',
            options: ['16°00′E', '15°06′E', '14°00′E', '9°00′E'],
            answer: 2,
            why: '900′ − 6′ × 10 = 840′ = 14°00′E.',
          },
          {
            q: 'Why does a compass rose print a year?',
            options: ['For copyright', 'Because magnetic variation changes over time', 'Because true north moves', 'Because charts expire each year'],
            answer: 1,
            why: 'Secular variation: the Earth\'s field drifts, so the printed value is only exact for that year.',
          },
        ]}
      />
    </>
  );
}
