import { useState } from 'react';
import { ChartView } from '../chart/ChartView';
import { POINTS, TSS, sx, sy } from '../chart/model';
import { Callout, NumField, Panel, Section, num } from '../components/ui';
import { angularDifference, formatBearing, trueToMagnetic } from '../lib/nav/bearing';
import { formatVariation } from '../lib/nav/variation';
import { VAR_NOW, VAR_NOW_MIN, legBetween } from './M07Course';
import { THIS_YEAR, type ModuleProps } from './types';

type Verdict = 'key' | 'note' | 'no';
interface Choice {
  id: string;
  label: string;
  verdict: Verdict;
  why: string;
}

const HAZARD_CHOICES: Choice[] = [
  { id: 'tss', label: 'The Traffic Separation Scheme', verdict: 'key', why: 'You cross both lanes and the separation zone: about 1.5 NM of the route.' },
  { id: 'rock', label: 'Submerged rock off Heron Island', verdict: 'key', why: 'About 0.2 NM off your line, right where you approach B. Come in wide or check the tide.' },
  { id: 'shoal', label: 'Cutter Shoal (with buoy G "3")', verdict: 'key', why: 'Just south of your first half-mile. Wind against current over it can kick up steep water.' },
  { id: 'ferry', label: 'The ferry route', verdict: 'note', why: 'You do not cross it, but the island terminal is about 1 NM north of B. Expect wakes and manoeuvring.' },
  { id: 'anch', label: 'The anchorage', verdict: 'no', why: 'Well north of the route.' },
  { id: 'restr', label: 'The restricted area', verdict: 'no', why: 'Well south of the route. Still read note A before any other trip here.' },
  { id: 'cable', label: 'The cable area', verdict: 'no', why: 'On the far side of the island.' },
];

const BAIL_CHOICES: Choice[] = [
  { id: 'gull', label: 'Back to Gull Point (A)', verdict: 'key', why: 'Your best bailout until you commit to the lanes.' },
  { id: 'mainS', label: 'Mainland beach south of Gull Point', verdict: 'key', why: 'An alternative before the crossing if Gull Point gets rough.' },
  { id: 'islSW', label: 'Heron Island south-west beach', verdict: 'key', why: 'Once you are past the lanes, it is the alternative if B is unsafe to land.' },
  { id: 'zone', label: 'Rest in the separation zone', verdict: 'no', why: 'Never. It is open water between two lanes of shipping.' },
  { id: 'buoy', label: 'Hold on to buoy G "3"', verdict: 'no', why: 'Mooring to a navigation aid is prohibited, and it sits on the edge of a shoal.' },
];

const INFO_CHOICES: Choice[] = [
  { id: 'cur', label: 'Tidal current predictions (speed, direction, slack)', verdict: 'key', why: 'Decides when to cross and how much to ferry-angle.' },
  { id: 'wind', label: 'Wind and marine forecast', verdict: 'key', why: 'Fetch to the south is long. Wind against current is the classic trap.' },
  { id: 'traffic', label: 'Ship and ferry traffic now (VTS, AIS, schedule, lookout)', verdict: 'key', why: 'The chart shows lanes, not ships.' },
  { id: 'vis', label: 'Visibility / fog', verdict: 'key', why: 'A TSS crossing in fog is a different decision.' },
  { id: 'tide', label: 'Height of tide for both landings', verdict: 'key', why: 'Decides whether A and B are beaches or mudflats, and how much water is over the rock.' },
  { id: 'temp', label: 'Water temperature and your immersion gear', verdict: 'key', why: 'Puget Sound is cold year-round, so plan for a swim.' },
  { id: 'bear', label: 'The true bearing from A to B', verdict: 'no', why: 'You already have this from the chart.' },
  { id: 'shoal', label: 'Where Cutter Shoal is', verdict: 'no', why: 'Charted.' },
];

function MultiPick({ legend, choices, picked, setPicked, revealed }: { legend: string; choices: Choice[]; picked: Set<string>; setPicked: (s: Set<string>) => void; revealed: boolean }) {
  return (
    <fieldset className="panel" style={{ margin: 0 }}>
      <legend className="panel-title">{legend}</legend>
      {choices.map((c) => {
        const on = picked.has(c.id);
        const tone = !revealed ? '' : c.verdict === 'key' ? (on ? 'var(--good)' : 'var(--warn)') : c.verdict === 'no' && on ? 'var(--bad)' : 'var(--muted)';
        return (
          <div key={c.id} style={{ display: 'grid', gap: 2 }}>
            <label className="check" htmlFor={`fx-${legend}-${c.id}`}>
              <input
                id={`fx-${legend}-${c.id}`}
                type="checkbox"
                checked={on}
                disabled={revealed}
                onChange={(e) => {
                  const n = new Set(picked);
                  if (e.target.checked) n.add(c.id);
                  else n.delete(c.id);
                  setPicked(n);
                }}
              />
              <span>{c.label}</span>
            </label>
            {revealed ? (
              <span style={{ fontSize: '0.85rem', color: tone, paddingLeft: 24 }}>
                {c.verdict === 'key' ? (on ? '✓ Yes. ' : 'Missed: ') : c.verdict === 'note' ? 'Worth noting: ' : on ? '✗ No: ' : ''}
                {c.why}
              </span>
            ) : null}
          </div>
        );
      })}
    </fieldset>
  );
}

export default function M13Final({ onScore }: ModuleProps) {
  const { distanceNm, trueCourse } = legBetween(POINTS.A, POINTS.B);
  const magCourse = trueToMagnetic(trueCourse, VAR_NOW);
  const [dist, setDist] = useState('');
  const [tru, setTru] = useState('');
  const [mag, setMag] = useState('');
  const [lane, setLane] = useState<'yes' | 'no' | ''>('');
  const [haz, setHaz] = useState<Set<string>>(new Set());
  const [bail, setBail] = useState<Set<string>>(new Set());
  const [info, setInfo] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const d = num(dist);
  const t = num(tru);
  const m = num(mag);
  const ready = d !== null && t !== null && m !== null && lane !== '';
  const okD = d !== null && Math.abs(d - distanceNm) <= 0.3;
  const okT = t !== null && angularDifference(t, trueCourse) <= 5;
  const okM = m !== null && angularDifference(m, magCourse) <= 5;
  const okLane = lane === 'yes';

  const submit = () => {
    setRevealed(true);
    const setScore = (cs: Choice[], s: Set<string>) => {
      const keys = cs.filter((c) => c.verdict === 'key');
      const hits = keys.filter((c) => s.has(c.id)).length;
      const wrong = cs.filter((c) => c.verdict === 'no' && s.has(c.id)).length;
      return Math.max(0, (hits - wrong) / keys.length);
    };
    const parts = [okD ? 1 : 0, okT ? 1 : 0, okM ? 1 : 0, okLane ? 1 : 0, setScore(HAZARD_CHOICES, haz), setScore(BAIL_CHOICES, bail), setScore(INFO_CHOICES, info)];
    onScore(parts.reduce((a, b) => a + b, 0) / parts.length);
  };
  const reset = () => {
    setDist('');
    setTru('');
    setMag('');
    setLane('');
    setHaz(new Set());
    setBail(new Set());
    setInfo(new Set());
    setRevealed(false);
  };

  const overlay = revealed ? (
    <g pointerEvents="none">
      <line x1={sx(POINTS.A[0])} y1={sy(POINTS.A[1])} x2={sx(POINTS.B[0])} y2={sy(POINTS.B[1])} stroke="var(--c-red)" strokeWidth={2.5} />
      <rect x={sx(TSS.westLane[0])} y={sy(5.2)} width={sx(TSS.eastLane[1]) - sx(TSS.westLane[0])} height={sy(4.4) - sy(5.2)} fill="var(--c-red)" fillOpacity={0.18} />
      {[POINTS.bailIslandSW, POINTS.bailMainlandS].map((p) => (
        <g key={p.join()}>
          <circle cx={sx(p[0])} cy={sy(p[1])} r={6} fill="var(--c-green)" stroke="#fff" strokeWidth={1.5} />
        </g>
      ))}
    </g>
  ) : null;

  const mark = (ok: boolean) => (revealed ? <span style={{ color: ok ? 'var(--good)' : 'var(--bad)', fontWeight: 600 }}>{ok ? ' ✓' : ' ✗'}</span> : null);

  return (
    <>
      <Callout title="Mission">
        You are kayaking from <strong>Point A</strong> (the beach at Gull Point) to <strong>Point B</strong> (Heron Island&apos;s west beach),
        in {THIS_YEAR}. Use the chart: the latitude border, the fictional compass rose (VAR 15°00′E 2025, 6′W per year) and
        the symbols. Answer everything, then reveal.
      </Callout>
      <div className="two-col">
        <div className="chart-frame">
          <ChartView showPoints overlay={overlay} ariaLabel="Final exercise chart, Point A at Gull Point and Point B on Heron Island" />
        </div>
        <div className="section">
          <Panel title="1–3 · Measure">
            <div className="fields">
              <NumField id="fe-d" label="1. Distance (NM)" value={dist} onChange={setDist} />
              {mark(okD)}
            </div>
            <div className="fields">
              <NumField id="fe-t" label="2. True bearing (°T)" value={tru} onChange={setTru} />
              {mark(okT)}
            </div>
            <div className="fields">
              <NumField id="fe-m" label={`3. Magnetic bearing (°M, ${THIS_YEAR})`} value={mag} onChange={setMag} />
              {mark(okM)}
            </div>
          </Panel>
          <fieldset className="panel" style={{ margin: 0 }}>
            <legend className="panel-title">5 · Do you cross a shipping lane?</legend>
            <div className="seg" role="group" aria-label="Do you cross a shipping lane?">
              {(['yes', 'no'] as const).map((v) => (
                <button key={v} type="button" aria-pressed={lane === v} disabled={revealed} onClick={() => setLane(v)}>
                  {v === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
            {revealed ? <span>{mark(okLane)} Yes: both lanes and the separation zone, from about 0.8 to 2.3 NM out.</span> : null}
          </fieldset>
        </div>
      </div>
      <div className="checklist">
        <MultiPick legend="4 · Largest charted hazards near the route" choices={HAZARD_CHOICES} picked={haz} setPicked={setHaz} revealed={revealed} />
        <MultiPick legend="6 · Safest bailout options" choices={BAIL_CHOICES} picked={bail} setPicked={setBail} revealed={revealed} />
        <MultiPick legend="7 · What you still need that the chart cannot give" choices={INFO_CHOICES} picked={info} setPicked={setInfo} revealed={revealed} />
      </div>
      <div className="pager">
        {!revealed ? (
          <>
            <span className="chart-caption">{ready ? 'Ready when you are.' : 'Fill in 1–3 and question 5 to reveal the solution.'}</span>
            <button type="button" className="btn" disabled={!ready} onClick={submit}>
              Reveal the solution
            </button>
          </>
        ) : (
          <button type="button" className="btn ghost" onClick={reset}>
            Start over
          </button>
        )}
      </div>
      {revealed ? (
        <Section title="Solution">
          <div className="table-wrap">
            <table>
              <tbody>
                <tr>
                  <th scope="row">1. Distance</th>
                  <td className="data">≈ {distanceNm.toFixed(1)} NM</td>
                  <td>Span A–B with dividers and read it on the latitude border beside the route. About {Math.round((distanceNm / 3) * 60)} minutes at 3 kn.</td>
                </tr>
                <tr>
                  <th scope="row">2. True</th>
                  <td className="data">≈ {formatBearing(trueCourse)} T</td>
                  <td>Parallel rule from the course line to the rose centre, read on the outer ring.</td>
                </tr>
                <tr>
                  <th scope="row">3. Magnetic</th>
                  <td className="data">≈ {formatBearing(magCourse)} M</td>
                  <td>
                    Variation in {THIS_YEAR}: {formatVariation(VAR_NOW_MIN)} = +{VAR_NOW.toFixed(1)}°. M = T − V = {trueCourse.toFixed(1)} −{' '}
                    {VAR_NOW.toFixed(1)} = {(trueCourse - VAR_NOW).toFixed(1)}.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout kind="warn" title="A better crossing">
            The direct line crosses the lanes at about {Math.round(angularDifference(trueCourse, 0))}° to the traffic. Consider paddling
            north up the mainland shore first, then crossing due east at 090° T, perpendicular to the lanes. Pick a time near slack current with
            a clear forecast, wait at the lane edge for a gap, and cross as a tight group.
          </Callout>
        </Section>
      ) : null}
    </>
  );
}
