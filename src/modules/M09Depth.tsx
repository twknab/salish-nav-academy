import { useState } from 'react';
import { Quiz } from '../components/Quiz';
import { Callout, ChartNotConditions, NumField, Panel, Section, Seg, Varies, num } from '../components/ui';
import { type DepthUnit, UNIT_LABEL, approxDepth, convertDepth, waterOverDrying } from '../lib/nav/depth';
import type { ModuleProps } from './types';

function Profile() {
  // y = 0 ft at y=150; 10 px per ft
  const y = (ft: number) => 150 - ft * 10;
  return (
    <svg viewBox="0 0 520 260" role="img" aria-label="Cross-section: chart datum MLLW, height of tide above it, charted depth below it, a drying bank above datum">
      <rect width={520} height={260} fill="var(--c-deep)" />
      <rect x={0} y={y(8)} width={520} height={260 - y(8)} fill="var(--c-shallow)" fillOpacity={0.55} />
      <path d={`M0,${y(-10)} L250,${y(-10)} C300,${y(-9)} 330,${y(1)} 380,${y(3)} L520,${y(4)} L520,260 L0,260Z`} fill="var(--c-land)" stroke="var(--c-ink)" />
      {[
        [10, 'Mean High Water (shoreline on the chart)'],
        [8, 'Height of tide now: +8 ft (from tide predictions)'],
        [0, 'Chart datum: Mean Lower Low Water (0)'],
        [-3, 'A minus tide: −3 ft (shallower than charted!)'],
      ].map(([ft, label]) => (
        <g key={ft as number}>
          <line x1={0} x2={520} y1={y(ft as number)} y2={y(ft as number)} stroke={ft === 8 ? 'var(--c-ink)' : 'var(--c-magenta)'} strokeDasharray={ft === 8 ? '0' : '5 4'} strokeWidth={ft === 8 ? 1.5 : 1} />
          <text x={6} y={y(ft as number) - 4} fontSize={10.5} fill={ft === 8 ? 'var(--c-ink)' : 'var(--c-magenta)'}>
            {label}
          </text>
        </g>
      ))}
      <line x1={150} x2={150} y1={y(0)} y2={y(-10)} stroke="var(--c-ink)" strokeWidth={1.5} />
      <text x={156} y={y(-5)} fontSize={11} fill="var(--c-ink)" fontStyle="italic">
        charted 10
      </text>
      <line x1={190} x2={190} y1={y(8)} y2={y(-10)} stroke="var(--c-red)" strokeWidth={2} />
      <text x={196} y={y(-1.5)} fontSize={11} fill="var(--c-red)" fontWeight={700}>
        ≈ 18 ft now
      </text>
      <line x1={455} x2={455} y1={y(0)} y2={y(3.8)} stroke="var(--c-ink)" strokeWidth={1.5} />
      <text x={418} y={y(1.3)} fontSize={11} fill="var(--c-ink)" textDecoration="underline">
        3
      </text>
      <text x={400} y={y(-2)} fontSize={10} fill="var(--c-ink)">
        drying height
      </text>
    </svg>
  );
}

function DepthCalc() {
  const [charted, setCharted] = useState('4');
  const [tide, setTide] = useState('-2.5');
  const [dry, setDry] = useState('3');
  const c = num(charted);
  const t = num(tide);
  const d = num(dry);
  return (
    <div className="two-col">
      <Panel title="Water over a charted sounding">
        <div className="fields">
          <NumField id="dp-c" label="Charted depth (ft)" value={charted} onChange={setCharted} />
          <NumField id="dp-t" label="Height of tide (ft)" value={tide} onChange={setTide} />
        </div>
        {c !== null && t !== null ? (
          <div className="result" aria-live="polite">
            <span className="big">≈ {approxDepth(c, t).toFixed(1)} ft</span>
            <span className="work">
              {c} + ({t}) = {approxDepth(c, t).toFixed(1)}
            </span>
            {approxDepth(c, t) <= 0 ? <span className="err">Dry or awash. That is no longer water.</span> : null}
          </div>
        ) : (
          <p className="err">Enter both numbers, in the same units.</p>
        )}
      </Panel>
      <Panel title="Water over a drying height (underlined)">
        <div className="fields">
          <NumField id="dp-d" label="Drying height (ft)" value={dry} onChange={setDry} />
          <NumField id="dp-t2" label="Height of tide (ft)" value={tide} onChange={setTide} />
        </div>
        {d !== null && t !== null ? (
          <div className="result" aria-live="polite">
            {waterOverDrying(d, t) > 0 ? (
              <span className="big">≈ {waterOverDrying(d, t).toFixed(1)} ft of water</span>
            ) : (
              <span className="big">exposed by {Math.abs(waterOverDrying(d, t)).toFixed(1)} ft</span>
            )}
            <span className="work">
              tide {t} − drying height {d} = {waterOverDrying(d, t).toFixed(1)}
            </span>
          </div>
        ) : (
          <p className="err">Enter both numbers.</p>
        )}
      </Panel>
    </div>
  );
}

function UnitConv() {
  const [v, setV] = useState('3');
  const [from, setFrom] = useState<DepthUnit>('fm');
  const n = num(v);
  return (
    <Panel title="Depth units">
      <div className="fields">
        <NumField id="uc-v" label="Value" value={v} onChange={setV} />
        <Seg
          label="In"
          value={from}
          onChange={setFrom}
          options={[
            { v: 'ft', label: 'feet' },
            { v: 'fm', label: 'fathoms' },
            { v: 'm', label: 'metres' },
          ]}
        />
      </div>
      {n !== null ? (
        <dl className="kv">
          {(['ft', 'fm', 'm'] as DepthUnit[]).map((u) => (
            <div key={u} style={{ display: 'contents' }}>
              <dt>{UNIT_LABEL[u]}</dt>
              <dd>{convertDepth(n, from, u).toFixed(u === 'fm' ? 2 : 1)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <p className="chart-caption">1 fathom = 6 ft exactly. 1 ft = 0.3048 m exactly.</p>
    </Panel>
  );
}

export default function M09Depth({ onScore }: ModuleProps) {
  return (
    <>
      <Section title="A sounding is not today's depth">
        <div className="prose">
          <p>
            Every sounding is measured down from <strong>chart datum</strong>. On U.S. tidal charts that is{' '}
            <strong>Mean Lower Low Water (MLLW)</strong>: the average of each day&apos;s lower low tide. Tide predictions use the same zero. So:
          </p>
          <p className="formula">approximate depth now = charted depth + height of tide</p>
          <p>
            Most of the time the tide is above datum and you have more water than charted. During a <strong>minus tide</strong> (common on
            Puget Sound&apos;s big spring lows) the tide is below datum and you have <em>less</em>.
          </p>
        </div>
        <div className="chart-frame">
          <Profile />
        </div>
      </Section>

      <Section title="Try it">
        <DepthCalc />
        <Callout kind="warn" title="Why it is only approximate">
          Predictions are astronomical. Wind and air pressure can raise or lower the real water level. The nearest tide station may be miles
          away, with different timing. Surveys can be old, and sandbars move. Treat the result as a planning estimate with margin.
        </Callout>
      </Section>

      <Section title="Feet, fathoms or metres? Check the chart">
        <div className="two-col">
          <div className="prose">
            <p>
              Look in the <strong>title block</strong> for a line such as <span className="data">SOUNDINGS IN FEET</span> or{' '}
              <span className="data">SOUNDINGS IN FATHOMS</span>, and check the margin notes. Fathom charts sometimes print fathoms and feet
              together in shallow water (e.g. 2₃ = 2 fathoms 3 feet).
            </p>
            <p>
              A sounding of <span className="data">3</span> is 3 ft on one chart and 18 ft on another. Canadian charts of the Salish Sea are
              in metres. Never assume the units because of where you are.
            </p>
          </div>
          <UnitConv />
        </div>
        <Varies>Units, datum and contour intervals are chosen per chart. Always read the title block of the chart in your hand.</Varies>
      </Section>
      <ChartNotConditions extra="Tide height is also not tidal current: high water and slack water often happen at different times." />

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'Charted 6 ft, predicted tide −2 ft. Approximate depth?',
            options: ['8 ft', '4 ft', '6 ft', '−2 ft'],
            answer: 1,
            why: '6 + (−2) = 4 ft.',
          },
          {
            q: 'An underlined 4 in a green area, tide +7 ft. Water over it?',
            options: ['11 ft', '3 ft', '4 ft', 'Exposed'],
            answer: 1,
            why: 'Underlined = drying height above datum. 7 − 4 = 3 ft.',
          },
          {
            q: 'A sounding reads 5 on a chart in fathoms. In feet?',
            options: ['5', '15', '30', '1.5'],
            answer: 2,
            why: '5 × 6 = 30 ft.',
          },
        ]}
      />
    </>
  );
}
