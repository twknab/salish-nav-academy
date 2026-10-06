import { useState } from 'react';
import { ChartView } from '../chart/ChartView';
import { MARGIN, POINTS, sx, sy, toLatLon } from '../chart/model';
import { Quiz } from '../components/Quiz';
import { Callout, NumField, Panel, Section, num } from '../components/ui';
import { formatDDM } from '../lib/nav/coords';
import { courseAndDistance, legDistance, lonMinuteNm, nmToKm, nmToStatuteMiles } from '../lib/nav/distance';
import type { ModuleProps } from './types';

const f2 = (n: number) => n.toFixed(2);

/** A strip of latitude border, 47°28′ to 47°31′, drawn to scale. */
function LatitudeStrip() {
  const top = 14;
  const minPx = 70;
  const mins = [31, 30, 29, 28];
  return (
    <svg viewBox="0 0 280 262" role="img" aria-label="Latitude border scale from 47 degrees 28 minutes to 47 degrees 31 minutes, with tenths of a minute">
      <rect x={0} y={0} width={280} height={262} fill="var(--c-deep)" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={110} y={top + i * minPx} width={12} height={minPx} fill={i % 2 ? '#fff' : 'var(--c-ink)'} stroke="var(--c-ink)" strokeWidth={0.8} />
      ))}
      {[0, 1, 2].flatMap((i) =>
        Array.from({ length: 9 }, (_, t) => {
          const y = top + i * minPx + ((t + 1) / 10) * minPx;
          return <line key={`${i}-${t}`} x1={t === 4 ? 98 : 103} x2={110} y1={y} y2={y} stroke="var(--c-ink)" strokeWidth={0.8} />;
        }),
      )}
      {mins.map((m, i) => (
        <text key={m} x={92} y={top + i * minPx + 4} fontSize={12} textAnchor="end" fill="var(--c-ink)" fontFamily="var(--font-data)">
          {m === 30 ? '47°30′' : `${m}′`}
        </text>
      ))}
      <g fontSize={11} fill="var(--c-magenta)" fontFamily="var(--font-body)">
        <path d={`M132,${top} h14 M139,${top} v${minPx} M132,${top + minPx} h14`} stroke="var(--c-magenta)" strokeWidth={1.4} />
        <text x={152} y={top + minPx / 2 - 6}>1 minute of latitude</text>
        <text x={152} y={top + minPx / 2 + 9} fontWeight={700}>= 1 nautical mile</text>
        <path d={`M132,${top + minPx * 2} h14 M139,${top + minPx * 2} v${minPx / 10} M132,${top + minPx * 2 + minPx / 10} h14`} stroke="var(--c-magenta)" strokeWidth={1.4} />
        <text x={152} y={top + minPx * 2 + 9}>0.1′ = 0.1 NM ≈ 608 ft</text>
      </g>
      <text x={140} y={254} fontSize={10} textAnchor="middle" fill="var(--c-ink)" fontFamily="var(--font-data)">
        60′ = 1° · read from the side border
      </text>
    </svg>
  );
}

/** Stepped dividers demo on the training chart: A → B, then onto the latitude border. */
function DividersDemo() {
  const [step, setStep] = useState(0);
  const { distanceNm } = courseAndDistance(toLatLon(POINTS.A), toLatLon(POINTS.B));
  const midY = (POINTS.A[1] + POINTS.B[1]) / 2;
  const a = { x: sx(POINTS.A[0]), y: sy(POINTS.A[1]) };
  const b = { x: sx(POINTS.B[0]), y: sy(POINTS.B[1]) };
  const borderX = MARGIN - 3.5;
  const y1 = sy(midY - distanceNm / 2);
  const y2 = sy(midY + distanceNm / 2);
  const hinge = (p: { x: number; y: number }, q: { x: number; y: number }, out: number) => {
    const mx = (p.x + q.x) / 2;
    const my = (p.y + q.y) / 2;
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: mx - (dy / len) * out, y: my + (dx / len) * out };
  };
  const legs = (p: { x: number; y: number }, q: { x: number; y: number }, out: number) => {
    const h = hinge(p, q, out);
    return (
      <g stroke="var(--c-red)" strokeWidth={2.2} strokeLinecap="round" fill="none">
        <path d={`M${p.x},${p.y} L${h.x},${h.y} L${q.x},${q.y}`} />
        <circle cx={h.x} cy={h.y} r={4} fill="var(--c-red)" />
      </g>
    );
  };
  const steps = [
    { title: 'Span the route', body: 'Open the dividers so one point sits on A and the other on B.' },
    {
      title: 'Carry them to the latitude scale',
      body: 'Without changing the spread, move the dividers to the side border at about the same latitude as the route. On a Mercator chart a minute of latitude grows slightly toward the poles, so measure beside your route rather than at the top or bottom of the chart.',
    },
    {
      title: 'Read minutes of latitude = nautical miles',
      body: `The dividers span about ${distanceNm.toFixed(1)}′ of latitude, so the route is about ${distanceNm.toFixed(1)} nautical miles.`,
    },
  ];
  const overlay = (
    <g>
      {step === 0 && (
        <>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--c-red)" strokeWidth={1} strokeDasharray="4 3" />
          {legs(a, b, 34)}
        </>
      )}
      {step >= 1 && (
        <>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--c-red)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
          {legs({ x: borderX, y: y1 }, { x: borderX, y: y2 }, -36)}
          <path d={`M${a.x - 8},${(a.y + b.y) / 2} C${a.x - 80},${(a.y + b.y) / 2} ${borderX + 60},${(y1 + y2) / 2} ${borderX + 42},${(y1 + y2) / 2}`} fill="none" stroke="var(--c-red)" strokeDasharray="3 3" markerEnd="" />
        </>
      )}
      {step === 2 && (
        <g>
          <rect x={borderX + 46} y={(y1 + y2) / 2 - 22} width={124} height={40} rx={4} fill="#fff" stroke="var(--c-red)" />
          <text x={borderX + 108} y={(y1 + y2) / 2 - 5} fontSize={12} textAnchor="middle" fill="var(--c-red)" fontWeight={700}>
            ≈ {distanceNm.toFixed(1)}′ of latitude
          </text>
          <text x={borderX + 108} y={(y1 + y2) / 2 + 11} fontSize={12} textAnchor="middle" fill="var(--c-red)" fontWeight={700}>
            ≈ {distanceNm.toFixed(1)} NM
          </text>
        </g>
      )}
    </g>
  );
  return (
    <div className="two-col">
      <div className="chart-frame">
        <ChartView showPoints overlay={overlay} ariaLabel="Training chart showing dividers measuring from A to B, then on the latitude border" />
      </div>
      <div className="panel">
        <div className="panel-title">
          Dividers, step {step + 1} of {steps.length}
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} style={{ opacity: i === step ? 1 : 0.5 }}>
              <div>
                <strong>{s.title}.</strong> {s.body}
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
        <p className="chart-caption">
          If the route is longer than the dividers comfortably span, set them to a round number (say 1′) and walk them along the route,
          counting steps.
        </p>
      </div>
    </div>
  );
}

function LatLonCompare() {
  const [lat, setLat] = useState('47.5');
  const phi = num(lat);
  const valid = phi !== null && phi >= -89.9 && phi <= 89.9;
  const k = valid ? lonMinuteNm(phi) : 0;
  const W = 300;
  return (
    <Panel title="One minute of latitude vs. one minute of longitude">
      <div className="fields">
        <NumField id="cmp-lat" label="Latitude (°)" value={lat} onChange={setLat} />
        <input
          aria-label="Latitude slider"
          type="range"
          min={0}
          max={80}
          step={0.5}
          value={valid ? Math.abs(phi) : 47.5}
          onChange={(e) => setLat(e.target.value)}
          style={{ flex: '1 1 160px', accentColor: 'var(--accent)' }}
        />
      </div>
      {valid ? (
        <svg viewBox={`0 0 ${W + 120} 70`} role="img" aria-label={`At ${phi} degrees, one minute of longitude is ${k.toFixed(2)} nautical miles`}>
          <rect x={0} y={8} width={W} height={16} fill="var(--water)" />
          <text x={W + 8} y={21} fontSize={12} fill="var(--fg)" fontFamily="var(--font-data)">
            1′ lat = 1.00 NM
          </text>
          <rect x={0} y={40} width={W * k} height={16} fill="var(--accent)" />
          <text x={W * k + 8} y={53} fontSize={12} fill="var(--fg)" fontFamily="var(--font-data)">
            1′ lon = {k.toFixed(2)} NM
          </text>
        </svg>
      ) : (
        <p className="err">Enter a latitude between −89.9 and 89.9.</p>
      )}
      <p className="work">1′ lon ≈ cos({valid ? phi : 'φ'}°) × 1 NM{valid ? ` = ${k.toFixed(3)} NM` : ''}</p>
    </Panel>
  );
}

function DistanceCalc() {
  const [lat, setLat] = useState('47.5');
  const [dLat, setDLat] = useState('1');
  const [dLon, setDLon] = useState('1');
  const l = num(lat);
  const a = num(dLat);
  const o = num(dLon);
  const ok = l !== null && a !== null && o !== null && Math.abs(l) < 90;
  const d = ok ? legDistance(l, a, o) : null;
  return (
    <Panel title="Distance calculator">
      <div className="fields">
        <NumField id="dc-lat" label="Mean latitude (°)" value={lat} onChange={setLat} />
        <NumField id="dc-dlat" label="Δ latitude (minutes)" value={dLat} onChange={setDLat} />
        <NumField id="dc-dlon" label="Δ longitude (minutes)" value={dLon} onChange={setDLon} />
      </div>
      {d ? (
        <div className="result" aria-live="polite">
          <dl className="kv">
            <dt>North / south</dt>
            <dd>{f2(d.northSouthNm)} NM</dd>
            <dt>East / west</dt>
            <dd>
              {f2(d.eastWestNm)} NM <span style={{ color: 'var(--muted)' }}>(= {o} × {lonMinuteNm(l!).toFixed(3)})</span>
            </dd>
            <dt>Straight line</dt>
            <dd>
              <span className="big">{f2(d.totalNm)} NM</span>
            </dd>
            <dt>Same, in km</dt>
            <dd>{f2(nmToKm(d.totalNm))} km</dd>
            <dt>Same, in statute mi</dt>
            <dd>{f2(nmToStatuteMiles(d.totalNm))} mi</dd>
          </dl>
          <p className="chart-caption">A flat-earth approximation: accurate for the few-mile legs a kayaker plans.</p>
        </div>
      ) : (
        <p className="err">Enter numbers for all three fields. Latitude must be between −90 and 90.</p>
      )}
    </Panel>
  );
}

interface Exercise {
  from: [number, number];
  to: [number, number];
  hint: string;
}
const EXERCISES: Exercise[] = [
  { from: [47 + 29 / 60, -(122 + 32 / 60)], to: [47 + 32.5 / 60, -(122 + 32 / 60)], hint: 'Same longitude, so only latitude changes: 3.5′ of latitude.' },
  {
    from: [47.5, -(122 + 34 / 60)],
    to: [47.5, -(122 + 30 / 60)],
    hint: 'Same latitude: 4′ of longitude is NOT 4 NM. At 47.5° it is 4 × 0.676 ≈ 2.70 NM. With dividers you would carry this span to the latitude scale and read about 2.7′.',
  },
  {
    from: [47 + 28 / 60, -(122 + 33 / 60)],
    to: [47 + 30 / 60, -(122 + 30 / 60)],
    hint: 'Δlat 2′ = 2.00 NM north. Δlon 3′ × 0.676 = 2.03 NM east. Straight line √(2.00² + 2.03²) ≈ 2.85 NM.',
  },
];

function Practice() {
  const [answers, setAnswers] = useState(['', '', '']);
  const [checked, setChecked] = useState([false, false, false]);
  return (
    <div className="section">
      {EXERCISES.map((ex, i) => {
        const truth = courseAndDistance({ lat: ex.from[0], lon: ex.from[1] }, { lat: ex.to[0], lon: ex.to[1] }).distanceNm;
        const a = num(answers[i] ?? '');
        const right = a !== null && Math.abs(a - truth) <= 0.1;
        return (
          <Panel key={i} title={`Practice ${i + 1}`}>
            <p>
              From <span className="data">{formatDDM(ex.from[0], 'lat', 1)}, {formatDDM(ex.from[1], 'lon', 1)}</span> to{' '}
              <span className="data">{formatDDM(ex.to[0], 'lat', 1)}, {formatDDM(ex.to[1], 'lon', 1)}</span>. How far, in nautical miles?
            </p>
            <div className="fields">
              <NumField
                id={`px-${i}`}
                label="Your answer (NM)"
                value={answers[i] ?? ''}
                onChange={(v) => {
                  setAnswers((s) => s.map((x, j) => (j === i ? v : x)));
                  setChecked((s) => s.map((x, j) => (j === i ? false : x)));
                }}
              />
              <button type="button" className="btn" onClick={() => setChecked((s) => s.map((x, j) => (j === i ? true : x)))} disabled={a === null}>
                Check
              </button>
            </div>
            {checked[i] ? (
              <div className={right ? 'callout' : 'callout warn'} aria-live="polite">
                <strong>{right ? `Yes — about ${truth.toFixed(2)} NM.` : `Not quite: about ${truth.toFixed(2)} NM.`}</strong>
                <div>{ex.hint}</div>
              </div>
            ) : null}
          </Panel>
        );
      })}
    </div>
  );
}

export default function M03Distance({ onScore }: ModuleProps) {
  return (
    <>
      <Section title="The rule">
        <div className="two-col">
          <div className="prose">
            <p>
              <strong>One minute of latitude is one nautical mile.</strong> The nautical mile was defined to fit the Earth: 60 minutes make
              a degree, and a minute of arc along a meridian is very nearly 1 NM everywhere.
            </p>
            <ul>
              <li>
                <span className="data">60′ = 1°</span>: so 47°30′ is 47.5°, and 47°30.6′ is 47° plus 30.6 minutes.
              </li>
              <li>
                <span className="data">1 NM = 1.852 km</span> exactly, which is about <span className="data">1.1508</span> statute miles.
              </li>
              <li>Charts show decimal minutes (30.6′). Some GPS units show seconds (30′36″). Know which one you are reading.</li>
              <li>A tenth of a minute (0.1′) is 0.1 NM, about 600 ft. That is roughly a 2-minute paddle at 3 knots.</li>
            </ul>
          </div>
          <div className="chart-frame">
            <LatitudeStrip />
          </div>
        </div>
      </Section>

      <Section title="Measuring with dividers">
        <DividersDemo />
      </Section>

      <Section title="Why the latitude scale and not the longitude scale">
        <div className="two-col">
          <div className="prose">
            <p>
              Meridians (lines of longitude) converge as they run toward the poles. At the equator a minute of longitude is about 1 NM. At
              the poles it is zero. In between, <strong>1′ of longitude ≈ cos(latitude) NM</strong>.
            </p>
            <p>
              Around Puget Sound (47–48° N), a minute of longitude is only about <strong>0.67–0.68 NM</strong>. Treat the top or bottom border
              as a mile ruler and every east–west distance comes out roughly <strong>50% too long</strong>.
            </p>
            <p>
              A paper Mercator chart stretches the east–west direction to keep angles true, and stretches north–south to match. The latitude
              scale beside your route always reads in real nautical miles. That is why navigators measure on the side border.
            </p>
            <Callout title="On a real chart">
              Measure on the latitude scale <em>beside</em> your route. On a large-area (small-scale) chart a minute of latitude near the top
              can be noticeably longer than one near the bottom.
            </Callout>
          </div>
          <LatLonCompare />
        </div>
      </Section>

      <Section title="Calculator">
        <DistanceCalc />
      </Section>

      <Section title="Practice">
        <Practice />
      </Section>

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'Your dividers span 2.4′ on the side border. How far is the route?',
            options: ['2.4 statute miles', '2.4 nautical miles', '1.6 nautical miles', 'It depends on the longitude'],
            answer: 1,
            why: 'Minutes of latitude read directly as nautical miles.',
          },
          {
            q: 'At 47.5° N a route runs due east for 3′ of longitude. About how long is it?',
            options: ['3.0 NM', '4.4 NM', '2.0 NM', '0.68 NM'],
            answer: 2,
            why: '3 × cos(47.5°) ≈ 3 × 0.676 ≈ 2.0 NM.',
          },
          {
            q: 'Why measure beside your route rather than at the chart\'s top edge?',
            options: [
              'The top edge is printed less accurately',
              'On a Mercator chart the latitude scale changes slightly with latitude',
              'Habit, nothing more',
              'Longitude changes with latitude',
            ],
            answer: 1,
            why: 'Mercator stretch grows toward the poles, so use the part of the scale at your route\'s latitude.',
          },
          {
            q: '1.0 NM is about…',
            options: ['1.000 km', '1.609 km', '1.852 km', '1.151 km'],
            answer: 2,
            why: '1 NM = 1.852 km exactly, ≈ 1.1508 statute miles.',
          },
        ]}
      />
    </>
  );
}
