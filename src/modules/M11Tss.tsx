import { useState } from 'react';
import { Quiz } from '../components/Quiz';
import { Callout, NumField, Panel, Section, num } from '../components/ui';
import { transitMinutes } from '../lib/nav/distance';
import type { ModuleProps } from './types';

function TssDiagram() {
  const M = 'var(--c-magenta)';
  const lane = (x: number, up: boolean) => (
    <path
      d={up ? `M${x},250 l0,-120 l-12,0 l20,-34 l20,34 l-12,0 l0,120z` : `M${x},40 l0,120 l-12,0 l20,34 l20,-34 l-12,0 l0,-120z`}
      fill="none"
      stroke={M}
      strokeWidth={1.6}
      transform={`translate(-8,0)`}
    />
  );
  return (
    <svg viewBox="0 0 560 330" role="img" aria-label="Traffic separation scheme: two one-way lanes, a separation zone between them, a precautionary area, and a kayak crossing at right angles">
      <rect width={560} height={330} fill="var(--c-deep)" />
      <rect x={0} y={0} width={70} height={330} fill="var(--c-land)" stroke="var(--c-ink)" />
      <rect x={490} y={0} width={70} height={330} fill="var(--c-land)" stroke="var(--c-ink)" />
      <rect x={250} y={0} width={60} height={330} fill={M} fillOpacity={0.16} />
      <line x1={150} x2={150} y1={0} y2={330} stroke={M} strokeDasharray="8 5" />
      <line x1={410} x2={410} y1={0} y2={330} stroke={M} strokeDasharray="8 5" />
      <line x1={250} x2={250} y1={0} y2={330} stroke={M} />
      <line x1={310} x2={310} y1={0} y2={330} stroke={M} />
      {lane(200, false)}
      {lane(360, true)}
      <g fontSize={11} fill={M} fontWeight={600} textAnchor="middle">
        <text x={200} y={22}>SOUTHBOUND LANE</text>
        <text x={360} y={22}>NORTHBOUND LANE</text>
        <text x={280} y={300} transform="rotate(-90 280 300)">SEPARATION ZONE</text>
      </g>
      <circle cx={280} cy={-40} r={110} fill="none" stroke={M} strokeDasharray="3 4" />
      <text x={280} y={56} fontSize={10} textAnchor="middle" fill={M}>
        precautionary area (where lanes meet)
      </text>
      {/* kayak crossing at right angles */}
      <line x1={80} x2={480} y1={225} y2={225} stroke="var(--c-red)" strokeWidth={2.5} strokeDasharray="10 5" />
      <path d="M470,218 l14,7 l-14,7z" fill="var(--c-red)" />
      <text x={86} y={216} fontSize={11} fill="var(--c-red)" fontWeight={700}>
        kayak: heading ≈ 90° to the lanes
      </text>
      <line x1={80} x2={470} y1={300} y2={190} stroke="var(--c-ink)" strokeWidth={1.2} strokeDasharray="3 4" />
      <text x={330} y={258} fontSize={10} fill="var(--c-ink)">
        diagonal crossing: longer in the lanes
      </text>
      <text x={35} y={170} fontSize={10} textAnchor="middle" fill="var(--c-ink)" transform="rotate(-90 35 170)">
        shore
      </text>
    </svg>
  );
}

function CrossingCalc() {
  const [width, setWidth] = useState('1.4');
  const [kayak, setKayak] = useState('3');
  const [ship, setShip] = useState('18');
  const w = num(width);
  const k = num(kayak);
  const s = num(ship);
  const ok = w !== null && k !== null && s !== null && w > 0 && k > 0 && s > 0;
  const mins = ok ? transitMinutes(w, k) : 0;
  const shipNm = ok ? (s * mins) / 60 : 0;
  return (
    <Panel title="How long are you exposed?">
      <div className="fields">
        <NumField id="tc-w" label="Width of lanes + zone (NM)" value={width} onChange={setWidth} />
        <NumField id="tc-k" label="Your speed (kn)" value={kayak} onChange={setKayak} />
        <NumField id="tc-s" label="Ship speed (kn)" value={ship} onChange={setShip} />
      </div>
      {ok ? (
        <div className="result" aria-live="polite">
          <div>
            <span className="big">{Math.round(mins)} min</span> in the scheme
          </div>
          <div>
            In that time a {s}-knot ship covers <strong>{shipNm.toFixed(1)} NM</strong>. A ship that far up the lane when you start can
            reach your track before you are clear.
          </div>
        </div>
      ) : (
        <p className="err">Enter three positive numbers.</p>
      )}
    </Panel>
  );
}

export default function M11Tss({ onScore }: ModuleProps) {
  return (
    <>
      <Callout kind="safety" title="Not a substitute for COLREGS training">
        This is an orientation to how a TSS works and what it means for a kayak. Learn the Navigation Rules (COLREGS / Inland Rules,
        especially Rules 5, 9 and 10) properly, from the official text and a course.
      </Callout>
      <Section title="Anatomy of a scheme">
        <div className="chart-frame">
          <TssDiagram />
        </div>
        <ul>
          <li>
            <strong>Traffic lanes</strong>: one-way, with direction shown by large outline arrows. Ships keep to the lane for their
            direction.
          </li>
          <li>
            <strong>Separation zone</strong>: the band between the lanes. You do not loiter or stop in it.
          </li>
          <li>
            <strong>Precautionary areas</strong>: where lanes join, split or cross, often off busy ports. Ships may be turning and
            converging, and there is no simple pattern to predict.
          </li>
          <li>All of it is drawn in magenta, with a chart note pointing to the rules that apply.</li>
        </ul>
      </Section>

      <Section title="What a kayaker should understand before crossing">
        <div className="two-col">
          <ol className="steps">
            <li>
              <div>
                <strong>You must not impede</strong> a power-driven vessel following a traffic lane (Rule 10). In practice: if a ship is
                coming, you wait.
              </div>
            </li>
            <li>
              <div>
                <strong>Cross on a heading as close as practical to 90°</strong> to the direction of traffic. That makes your time in the
                lanes shortest, and makes your intention obvious.
              </div>
            </li>
            <li>
              <div>
                <strong>Cross at the narrowest point</strong>, away from precautionary areas, and away from where ferries manoeuvre.
              </div>
            </li>
            <li>
              <div>
                <strong>Look both ways, then keep looking.</strong> Ships at 15–20 knots close a mile in 3–4 minutes. They may not see a
                kayak visually or on radar, and they cannot stop or swerve.
              </div>
            </li>
            <li>
              <div>
                <strong>Group tightly and keep moving.</strong> A strung-out group is a long obstacle. Never stop in a lane to regroup.
              </div>
            </li>
            <li>
              <div>
                <strong>Listen.</strong> Puget Sound has a Vessel Traffic Service (&quot;Seattle Traffic&quot;). Monitoring its VHF working
                channel for your area (listed in the Coast Pilot) tells you what ships are doing. AIS apps help too, but not every vessel
                carries AIS.
              </div>
            </li>
            <li>
              <div>
                <strong>Have a plan B</strong>: turn back, or wait at the lane edge. Decide on the beach what will make you hold.
              </div>
            </li>
          </ol>
          <CrossingCalc />
        </div>
      </Section>

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'Best heading for crossing a north–south TSS?',
            options: ['Diagonally, toward your destination', 'Roughly east or west, at right angles to the lanes', 'Along the separation zone', 'With the traffic'],
            answer: 1,
            why: 'A heading near 90° to the traffic flow minimises time in the lanes and makes your intent clear.',
          },
          {
            q: 'Halfway across, your group spreads out. What do you do?',
            options: ['Stop in the separation zone to regroup', 'Keep moving and close up as you go', 'Turn and paddle along the lane', 'Raft up in the lane'],
            answer: 1,
            why: 'Never stop in the scheme. Regroup on the far side.',
          },
          {
            q: 'A ship is southbound in the lane, 2 NM away. Your crossing will take 25 minutes. It is doing 18 knots. Safe to go?',
            options: ['Yes, 2 miles is far', 'No: it covers about 7.5 NM in 25 minutes', 'Only if it sees you', 'Yes, if you paddle fast'],
            answer: 1,
            why: '18 kn × 25/60 h ≈ 7.5 NM. It will reach your track long before you are clear.',
          },
        ]}
      />
    </>
  );
}
