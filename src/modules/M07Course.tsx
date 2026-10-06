import { useState } from 'react';
import { ChartView } from '../chart/ChartView';
import {
  BUOY,
  LANDMARK,
  LIGHTHOUSE,
  POINTS,
  ROSE,
  ROSE_ANNUAL_MINUTES,
  ROSE_TEXT,
  ROSE_VAR_MINUTES,
  type Pt,
  sx,
  sy,
  toLatLon,
} from '../chart/model';
import { Quiz } from '../components/Quiz';
import { Callout, NumField, Panel, Section, num } from '../components/ui';
import { explainMagneticToTrue, explainTrueToMagnetic, formatBearing, magneticToTrue, normalize, reciprocal, trueToMagnetic } from '../lib/nav/bearing';
import { courseAndDistance } from '../lib/nav/distance';
import { formatVariation, minutesToDegrees, updateVariation } from '../lib/nav/variation';
import { THIS_YEAR, type ModuleProps } from './types';

export const VAR_NOW_MIN = updateVariation(ROSE_VAR_MINUTES, ROSE_ANNUAL_MINUTES, ROSE_TEXT.year, THIS_YEAR);
export const VAR_NOW = minutesToDegrees(VAR_NOW_MIN);

export function legBetween(a: Pt, b: Pt) {
  return courseAndDistance(toLatLon(a), toLatLon(b));
}

/** Point `dist` NM from p along true bearing `brg`. */
function along(p: Pt, brg: number, dist: number): Pt {
  const r = (brg * Math.PI) / 180;
  return [p[0] + Math.sin(r) * dist, p[1] + Math.cos(r) * dist];
}

function PlotDemo() {
  const [step, setStep] = useState(0);
  const { trueCourse, distanceNm } = legBetween(POINTS.A, POINTS.B);
  const mag = trueToMagnetic(trueCourse, VAR_NOW);
  const steps = [
    ['Draw the course line', 'Join A to B with a pencil line. Check it clears every hazard: here, Cutter Shoal and the rock off Heron Island.'],
    ['Walk the parallel rule to the rose', 'Keep the rule parallel to the course line and walk it until one edge passes through the centre of the compass rose. A plotter does the same job by lining up with the meridians.'],
    ['Read the TRUE course on the outer ring', `Read on the side of the rose you are heading toward: about ${formatBearing(trueCourse)} T.`],
    ['Apply this year\'s variation', `The rose is ${formatVariation(ROSE_VAR_MINUTES)} (${ROSE_TEXT.year}), changing 6′W a year. For ${THIS_YEAR}: ${formatVariation(VAR_NOW_MIN)} → +${VAR_NOW.toFixed(1)}°.`],
    ['Get the MAGNETIC course', `M = T − V: ${explainTrueToMagnetic(Math.round(trueCourse), Number(VAR_NOW.toFixed(1)))} → steer about ${formatBearing(mag)} M.`],
    ['Steer it, and watch for drift', `Hold ${formatBearing(mag)} on the deck compass. Pick a landmark beyond B on that heading and watch whether it slides sideways. That is current or wind setting you off the line. ${distanceNm.toFixed(1)} NM at 3 kn ≈ ${Math.round((distanceNm / 3) * 60)} min.`],
  ];
  const c = { x: sx(ROSE.c[0]), y: sy(ROSE.c[1]) };
  const r = (trueCourse * Math.PI) / 180;
  const ux = Math.sin(r);
  const uy = -Math.cos(r);
  const half = 80;
  const overlay = (
    <g pointerEvents="none">
      <line x1={sx(POINTS.A[0])} y1={sy(POINTS.A[1])} x2={sx(POINTS.B[0])} y2={sy(POINTS.B[1])} stroke="var(--c-red)" strokeWidth={2} />
      {step >= 1 && (
        <g>
          <rect
            x={c.x - half}
            y={c.y - 7}
            width={half * 2}
            height={14}
            fill="var(--c-red)"
            fillOpacity={0.18}
            stroke="var(--c-red)"
            transform={`rotate(${trueCourse - 90} ${c.x} ${c.y})`}
          />
          <line x1={c.x - ux * half} y1={c.y - uy * half} x2={c.x + ux * half} y2={c.y + uy * half} stroke="var(--c-red)" strokeWidth={1.5} />
        </g>
      )}
      {step >= 2 && (
        <g>
          <circle cx={c.x + ux * 88} cy={c.y + uy * 88} r={9} fill="none" stroke="var(--c-red)" strokeWidth={2} />
          <text x={c.x + ux * 88 + 12} y={c.y + uy * 88 - 10} fontSize={11} fontWeight={700} fill="var(--c-red)" stroke="#fff" strokeWidth={3} paintOrder="stroke">
            {formatBearing(trueCourse)} T
          </text>
        </g>
      )}
      {step >= 4 && (
        <text x={c.x + ux * 60 + 8} y={c.y + uy * 60 + 14} fontSize={11} fontWeight={700} fill="var(--c-magenta)" stroke="#fff" strokeWidth={3} paintOrder="stroke">
          {formatBearing(mag)} M
        </text>
      )}
    </g>
  );
  return (
    <div className="two-col">
      <div className="chart-frame">
        <ChartView showPoints overlay={overlay} ariaLabel="Plotting the course from A to B and transferring it to the compass rose" />
      </div>
      <div className="panel">
        <div className="panel-title">
          Plotting A → B · step {step + 1} of {steps.length}
        </div>
        <ol className="steps">
          {steps.map(([t, b], i) => (
            <li key={t} style={{ opacity: i === step ? 1 : 0.5 }}>
              <div>
                <strong>{t}.</strong> {b}
              </div>
            </li>
          ))}
        </ol>
        <div className="pager">
          <button type="button" className="btn ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
          <button type="button" className="btn" disabled={step === steps.length - 1} onClick={() => setStep((s) => s + 1)}>
            Next step
          </button>
        </div>
      </div>
    </div>
  );
}

const TRUE_POS: Pt = [3.15, 5.75]; // where the kayak actually is, for the bearing-fix demo

function FixDemo() {
  const tLight = legBetween(TRUE_POS, LIGHTHOUSE.at).trueCourse;
  const tTank = legBetween(TRUE_POS, LANDMARK.at).trueCourse;
  const [mLight, setMLight] = useState(String(Math.round(trueToMagnetic(tLight, VAR_NOW))));
  const [mTank, setMTank] = useState(String(Math.round(trueToMagnetic(tTank, VAR_NOW))));
  const lines: { from: Pt; mag: number | null; name: string }[] = [
    { from: LIGHTHOUSE.at, mag: num(mLight), name: 'Heron Pt Lt' },
    { from: LANDMARK.at, mag: num(mTank), name: 'TANK' },
  ];
  const overlay = (
    <g pointerEvents="none">
      {lines.map((l) => {
        if (l.mag === null) return null;
        const t = magneticToTrue(l.mag, VAR_NOW);
        const end = along(l.from, reciprocal(t), 6);
        return (
          <g key={l.name}>
            <line x1={sx(l.from[0])} y1={sy(l.from[1])} x2={sx(end[0])} y2={sy(end[1])} stroke="var(--c-red)" strokeWidth={1.6} strokeDasharray="7 3" />
          </g>
        );
      })}
    </g>
  );
  return (
    <div className="two-col">
      <div className="chart-frame">
        <ChartView overlay={overlay} ariaLabel="Lines of position from compass bearings to the lighthouse and the tank" />
      </div>
      <Panel title="Fix your position with two bearings">
        <p>
          On the water you sight the lighthouse and the tank with a hand-bearing compass. Convert each <strong>magnetic</strong> reading to{' '}
          <strong>true</strong>, then draw a line from the object back toward you. You are where the lines cross.
        </p>
        <div className="fields">
          <NumField id="fx-l" label="Lighthouse (°M)" value={mLight} onChange={setMLight} />
          <NumField id="fx-t" label="TANK (°M)" value={mTank} onChange={setMTank} />
        </div>
        <div className="result">
          {lines.map((l) =>
            l.mag === null ? null : (
              <div key={l.name} className="work">
                {l.name}: T = M + V = {explainMagneticToTrue(l.mag, Number(VAR_NOW.toFixed(1)))}. Plot the reciprocal{' '}
                {formatBearing(reciprocal(magneticToTrue(l.mag, VAR_NOW)))} from the object.
              </div>
            ),
          )}
        </div>
        <p className="chart-caption">
          Try changing one bearing by 5° and watch the fix move. Objects about 90° apart give the sharpest fix. Shallow angles smear it
          along the lines.
        </p>
      </Panel>
    </div>
  );
}

function Worked() {
  const legs: { from: string; to: string; a: Pt; b: Pt }[] = [
    { from: 'A (Gull Pt)', to: 'B (Heron I.)', a: POINTS.A, b: POINTS.B },
    { from: 'B (Heron I.)', to: 'A (Gull Pt)', a: POINTS.B, b: POINTS.A },
    { from: 'A (Gull Pt)', to: 'Buoy G "3"', a: POINTS.A, b: BUOY.at },
    { from: 'Heron I. SW beach', to: 'Mainland S beach', a: POINTS.bailIslandSW, b: POINTS.bailMainlandS },
  ];
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>From → to</th>
            <th>Distance</th>
            <th>True</th>
            <th>
              Var ({THIS_YEAR})
            </th>
            <th>Magnetic</th>
          </tr>
        </thead>
        <tbody>
          {legs.map((l) => {
            const { trueCourse, distanceNm } = legBetween(l.a, l.b);
            return (
              <tr key={l.from + l.to}>
                <td>
                  {l.from} → {l.to}
                </td>
                <td className="data">{distanceNm.toFixed(2)} NM</td>
                <td className="data">{formatBearing(trueCourse)}</td>
                <td className="data">+{VAR_NOW.toFixed(1)}° (E)</td>
                <td className="data">
                  <strong>{formatBearing(normalize(trueCourse - VAR_NOW))}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function M07Course({ onScore }: ModuleProps) {
  return (
    <>
      <Section title="Chart to compass: plot, then convert">
        <PlotDemo />
      </Section>
      <Section title="Worked examples on the training chart">
        <p>
          All use the fictional rose updated to {THIS_YEAR} ({formatVariation(VAR_NOW_MIN)}). Notice the return leg is the reciprocal,
          exactly 180° different, in both true and magnetic.
        </p>
        <Worked />
      </Section>
      <Section title="Compass to chart: a bearing becomes a line">
        <FixDemo />
        <Callout title="Steering vs. track">
          The course you steer and the track you actually make over the ground differ whenever current or wind push you sideways. On a 3 NM
          crossing with a 1-knot cross-current, you could be set roughly a mile off. Correcting for that is ferry-gliding, and it needs current
          predictions, not the chart.
        </Callout>
      </Section>
      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'You lay the parallel rule through the rose centre. Which ring do you read for the course to plot or log as TRUE?',
            options: ['Inner ring', 'Outer ring', 'Either', 'The latitude scale'],
            answer: 1,
            why: 'Outer ring = true. Inner ring = magnetic for the rose year only. It does not account for annual change.',
          },
          {
            q: 'True course 062°, variation 14.9° E. Steer about…',
            options: ['077° M', '047° M', '062° M', '242° M'],
            answer: 1,
            why: '62 − 14.9 ≈ 47°.',
          },
          {
            q: 'You see a tank bearing 300° M; variation 15° E. What do you draw on the chart from the tank?',
            options: ['A line toward 315° T', 'A line toward 135° T (the reciprocal)', 'A line toward 285° T', 'A circle'],
            answer: 1,
            why: 'True bearing to the tank = 300 + 15 = 315° T. You are on the line running back from the tank at 135° T.',
          },
        ]}
      />
    </>
  );
}
