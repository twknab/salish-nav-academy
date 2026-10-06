import { useState } from 'react';
import { ChartView } from '../chart/ChartView';
import { type Pt, fromLatLon, sx, sy, toLatLon } from '../chart/model';
import { Quiz } from '../components/Quiz';
import { NumField, Panel, Section, Seg, num } from '../components/ui';
import { type Axis, formatDDM, parseDDM } from '../lib/nav/coords';
import { courseAndDistance } from '../lib/nav/distance';
import type { ModuleProps } from './types';

const TARGETS: { lat: number; lon: number; what: string }[] = [
  { lat: 47 + 32.0 / 60, lon: -(122 + 30.0 / 60), what: 'a GPS waypoint mid-channel' },
  { lat: 47 + 30.6 / 60, lon: -(122 + 28.0 / 60), what: 'a campsite on Heron Island' },
  { lat: 47 + 28.4 / 60, lon: -(122 + 32.4 / 60), what: 'a position someone radioed you' },
  { lat: 47 + 34.5 / 60, lon: -(122 + 33.0 / 60), what: 'a spot near the anchorage' },
  { lat: 47 + 31.5 / 60, lon: -(122 + 25.5 / 60), what: 'a point in the east passage' },
];

function ClickExercise() {
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState<Pt | null>(null);
  const t = TARGETS[i % TARGETS.length]!;
  const truth = fromLatLon({ lat: t.lat, lon: t.lon });
  const err = guess ? courseAndDistance(toLatLon(guess), { lat: t.lat, lon: t.lon }).distanceNm : null;
  const g = guess ? toLatLon(guess) : null;
  const overlay = (
    <g pointerEvents="none">
      {guess && (
        <>
          <circle cx={sx(guess[0])} cy={sy(guess[1])} r={6} fill="var(--c-red)" stroke="#fff" strokeWidth={1.5} />
          <circle cx={sx(truth[0])} cy={sy(truth[1])} r={7} fill="none" stroke="var(--c-green)" strokeWidth={2.5} />
          <line x1={sx(truth[0])} y1={sy(truth[1]) - 12} x2={sx(truth[0])} y2={sy(truth[1]) + 12} stroke="var(--c-green)" strokeWidth={1.5} />
          <line x1={sx(truth[0]) - 12} y1={sy(truth[1])} x2={sx(truth[0]) + 12} y2={sy(truth[1])} stroke="var(--c-green)" strokeWidth={1.5} />
        </>
      )}
    </g>
  );
  return (
    <div className="two-col">
      <div className="chart-frame">
        <ChartView onPick={(p) => setGuess(p)} overlay={overlay} ariaLabel="Click the chart where you think the coordinate is" />
      </div>
      <Panel title={`Plot it · ${(i % TARGETS.length) + 1} of ${TARGETS.length}`}>
        <p>
          Click where you think <strong>{t.what}</strong> is:
        </p>
        <p className="big" style={{ fontSize: '1.15rem' }}>
          {formatDDM(t.lat, 'lat', 1)}
          <br />
          {formatDDM(t.lon, 'lon', 1)}
        </p>
        <ol className="steps">
          <li>
            <div>Find the latitude on the side border. Each black or white bar is 1′, and the small ticks are tenths.</div>
          </li>
          <li>
            <div>Find the longitude on the top or bottom border. West longitudes get smaller to the east (right).</div>
          </li>
          <li>
            <div>On paper, run a straightedge or dividers in from both borders. The point is where they meet.</div>
          </li>
        </ol>
        {guess && err !== null && g ? (
          <div className={err <= 0.15 ? 'callout' : 'callout warn'} aria-live="polite">
            <strong>{err <= 0.15 ? 'Good plot.' : 'Off a bit.'}</strong>
            <div>
              You clicked {formatDDM(g.lat, 'lat', 1)}, {formatDDM(g.lon, 'lon', 1)}: about {err.toFixed(2)} NM ({Math.round(err * 6076)} ft)
              from the target, marked with the green cross.
            </div>
          </div>
        ) : (
          <p className="chart-caption">Your click shows as a red dot. The answer appears as a green cross.</p>
        )}
        <div className="pager">
          <button type="button" className="btn ghost" disabled={!guess} onClick={() => setGuess(null)}>
            Try again
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setI((v) => v + 1);
              setGuess(null);
            }}
          >
            Next coordinate
          </button>
        </div>
      </Panel>
    </div>
  );
}

function Converter() {
  const [axis, setAxis] = useState<Axis>('lat');
  const [txt, setTxt] = useState('47 31.2 N');
  const [dec, setDec] = useState('47.52');
  const parsed = parseDDM(txt, axis);
  const d = num(dec);
  return (
    <Panel title="Format converter">
      <Seg
        label="Coordinate"
        value={axis}
        onChange={(a) => {
          setAxis(a);
          setTxt(a === 'lat' ? '47 31.2 N' : '122 28.5 W');
          setDec(a === 'lat' ? '47.52' : '-122.475');
        }}
        options={[
          { v: 'lat', label: 'Latitude' },
          { v: 'lon', label: 'Longitude' },
        ]}
      />
      <div className="fields">
        <NumField id="cv-ddm" label="Degrees + decimal minutes" value={txt} onChange={setTxt} wide />
        <div className="work">→ {parsed === null ? 'cannot read that' : `${parsed.toFixed(5)}° decimal`}</div>
      </div>
      <div className="fields">
        <NumField id="cv-dd" label="Decimal degrees (− = S/W)" value={dec} onChange={setDec} wide />
        <div className="work">→ {d === null ? 'enter a number' : formatDDM(d, axis, 2)}</div>
      </div>
    </Panel>
  );
}

export default function M08Position({ onScore }: ModuleProps) {
  return (
    <>
      <Section title="Reading a position">
        <div className="prose">
          <p>
            A position is two numbers. <strong>Latitude</strong> is how far north or south of the equator (0–90°, N or S).{' '}
            <strong>Longitude</strong> is how far east or west of Greenwich (0–180°, E or W). Puget Sound is about 47–48° N, 122–123° W.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Example</th>
                  <th>Where you see it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Degrees + decimal minutes</td>
                  <td className="data">47°31.20′ N 122°28.50′ W</td>
                  <td>Chart borders, most marine GPS units, VHF position reports</td>
                </tr>
                <tr>
                  <td>Degrees, minutes, seconds</td>
                  <td className="data">47°31′12″ N 122°28′30″ W</td>
                  <td>Some apps and older documents (12″ = 0.2′)</td>
                </tr>
                <tr>
                  <td>Decimal degrees</td>
                  <td className="data">47.52000, −122.47500</td>
                  <td>Phone map apps. Minus means S or W.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Latitude always comes first. Mixing up seconds and decimal minutes (30″ vs 0.30′) is a classic error: 30″ is 0.5′, half a mile
            off.
          </p>
        </div>
        <Converter />
      </Section>
      <Section title="Plot a coordinate">
        <ClickExercise />
      </Section>
      <Quiz
        onScore={onScore}
        questions={[
          {
            q: '47°30.5′ N is the same as…',
            options: ['47.305°', '47.5083°', '47.55°', '47°30′05″'],
            answer: 1,
            why: '30.5 ÷ 60 = 0.5083.',
          },
          {
            q: 'Moving east in Puget Sound, west longitude numbers…',
            options: ['Increase', 'Decrease', 'Stay the same', 'Become east longitudes'],
            answer: 1,
            why: 'You are getting closer to Greenwich, so 122°30′ W is east of 122°36′ W.',
          },
          {
            q: 'Your GPS says 47°31′30″. On a chart with decimal minutes, that is…',
            options: ['47°31.30′', '47°31.5′', '47°31.03′', '47°30.5′'],
            answer: 1,
            why: '30″ ÷ 60 = 0.5′.',
          },
        ]}
      />
    </>
  );
}
