import { useState } from 'react';
import { ChartView } from '../chart/ChartView';
import { DRYING_ROCK, POINTS, PX, SHOAL, SUNKEN_ROCK, TSS, path, sx, sy } from '../chart/model';
import { Quiz } from '../components/Quiz';
import { ChartNotConditions, Section } from '../components/ui';
import type { ModuleProps } from './types';

type Shown = 'on' | 'partly' | 'off';
interface Hazard {
  name: string;
  shown: Shown;
  chart: string;
  need: string;
}

const HAZARDS: Hazard[] = [
  { name: 'Commercial shipping lanes', shown: 'on', chart: 'TSS lanes and arrows.', need: 'Where ships are now: VTS radio, AIS, lookout.' },
  { name: 'Ferries', shown: 'partly', chart: 'Approximate route line and terminals.', need: 'Ferry schedule. Expect deviations from the line.' },
  { name: 'Crossing a TSS', shown: 'on', chart: 'Lane width and direction of traffic.', need: 'Traffic now, visibility, your crossing speed.' },
  { name: 'Ferry terminals and manoeuvring zones', shown: 'partly', chart: 'Terminal location, sometimes regulated zones.', need: 'Schedule, security-zone rules (Coast Pilot / LNM).' },
  { name: 'Blind corners and narrow channels', shown: 'partly', chart: 'Shape of the shore and the channel.', need: 'Local knowledge. Boats appear with little warning.' },
  { name: 'Strong tidal currents', shown: 'partly', chart: 'Sometimes a current arrow or note, with no live speed.', need: 'NOAA tidal current predictions for the nearest station.' },
  { name: 'Current acceleration around points', shown: 'off', chart: 'Only the shape of the point, which hints at it.', need: 'Current predictions, Coast Pilot, local knowledge.' },
  { name: 'Tide rips and overfalls', shown: 'partly', chart: 'Sometimes labelled "Tide rips" with a symbol.', need: 'Current timing and wind. Rips depend on both.' },
  { name: 'Standing waves', shown: 'off', chart: 'Not shown. A shoal in a current is the clue.', need: 'Current speed now, plus local knowledge.' },
  { name: 'Eddy lines', shown: 'off', chart: 'Not shown.', need: 'Current predictions and reading the water.' },
  { name: 'Shoals', shown: 'on', chart: 'Soundings, contours, blue tint.', need: 'Height of tide, to judge depth over them.' },
  { name: 'Submerged rocks', shown: 'on', chart: 'Rock symbols, danger circles.', need: 'Height of tide and swell, which make them break.' },
  { name: 'Drying rocks', shown: 'on', chart: 'Rock symbol with drying height.', need: 'Height of tide now.' },
  { name: 'Reefs and ledges', shown: 'on', chart: 'Rock clusters and labels.', need: 'Swell and tide height.' },
  { name: 'Surf zones', shown: 'off', chart: 'Exposed beaches, but no surf information.', need: 'Swell forecast. Rare inside Puget Sound, real on the outer coast and Strait.' },
  { name: 'Lee shores', shown: 'off', chart: 'Shoreline only.', need: 'Wind forecast. A lee shore is the one the wind blows onto.' },
  { name: 'Exposed crossings', shown: 'on', chart: 'Width of open water, by measurement.', need: 'Wind, current and traffic for the time you will be out there.' },
  { name: 'Fetch', shown: 'partly', chart: 'Distance of open water upwind, by measurement.', need: 'Wind direction and strength.' },
  { name: 'Wind against current', shown: 'off', chart: 'Not shown.', need: 'Current predictions + wind forecast together.' },
  { name: 'Fog / reduced visibility', shown: 'off', chart: 'Not shown.', need: 'Forecast, marine observations. Plan for it in summer mornings.' },
  { name: 'Cold-water immersion', shown: 'off', chart: 'Not shown.', need: 'Water temperature. Puget Sound is cold all year, so dress for immersion.' },
  { name: 'Limited landing opportunities', shown: 'partly', chart: 'Shoreline type, steep contours, drying areas.', need: 'Tide height, land ownership/access, local guides.' },
  { name: 'Steep shorelines / cliffs', shown: 'partly', chart: 'Contours close to shore, sometimes cliff symbols on land.', need: 'Topographic maps, local knowledge.' },
];

const SOURCES = [
  ['Tide predictions', 'Height of tide at a place and time (NOAA CO-OPS).'],
  ['Tidal current predictions', 'Speed, direction and slack times at current stations. Not the same as tide height!'],
  ['Marine weather forecast', 'Wind, waves, visibility (NWS marine forecasts, NOAA Weather Radio).'],
  ['U.S. Coast Pilot', 'Plain-language descriptions of hazards, currents, regulations (Coast Pilot 7 covers the Pacific coast incl. Puget Sound).'],
  ['Local Notice to Mariners', 'Changes to aids, new hazards, closures (issued by the U.S. Coast Guard district covering the Pacific Northwest).'],
  ['VTS / AIS awareness', 'Puget Sound Vessel Traffic Service on VHF and AIS apps show large-vessel traffic.'],
  ['Local knowledge', 'Clubs, guides, and paddlers who know where the water misbehaves.'],
];

const label: Record<Shown, string> = { on: 'On the chart', partly: 'Partly', off: 'Needs other info' };

function HazardOverlay() {
  const red = 'var(--c-red)';
  const tip = POINTS.A;
  return (
    <g pointerEvents="none">
      <rect x={sx(TSS.westLane[0])} y={sy(9)} width={(TSS.eastLane[1] - TSS.westLane[0]) * PX} height={9 * PX} fill={red} fillOpacity={0.12} />
      <path d={path([POINTS.ferryWest, POINTS.ferryEast], false)} stroke={red} strokeOpacity={0.35} strokeWidth={14} fill="none" />
      <ellipse cx={sx(SHOAL.c[0])} cy={sy(SHOAL.c[1])} rx={SHOAL.rx * PX + 12} ry={SHOAL.ry * PX + 12} fill="none" stroke={red} strokeWidth={2} strokeDasharray="5 3" />
      {[SUNKEN_ROCK.at, DRYING_ROCK.at].map((p) => (
        <circle key={p.join()} cx={sx(p[0])} cy={sy(p[1])} r={17} fill="none" stroke={red} strokeWidth={2} strokeDasharray="5 3" />
      ))}
      {/* current acceleration around Gull Point: illustrative only */}
      <defs>
        <marker id="hz-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10z" fill={red} />
        </marker>
      </defs>
      <path d={`M${sx(tip[0] - 0.2)},${sy(tip[1] - 0.75)} q${0.55 * PX},${-0.25 * PX} ${0.45 * PX},${-0.95 * PX}`} stroke={red} strokeWidth={2.5} fill="none" markerEnd="url(#hz-arrow)" />
      <text x={sx(tip[0] + 0.45)} y={sy(tip[1] - 0.6)} fontSize={9} fill={red} fontWeight={700}>
        current may accelerate
      </text>
      <text x={sx(tip[0] + 0.45)} y={sy(tip[1] - 0.6) + 11} fontSize={8} fill={red}>
        (not shown on chart: check predictions)
      </text>
      {/* fetch from the south */}
      <line x1={sx(4.6)} y1={sy(0.3)} x2={sx(4.6)} y2={sy(2.6)} stroke={red} strokeWidth={2} strokeDasharray="2 3" />
      <path d={`M${sx(4.6)},${sy(2.6)} l-5,9 l10,0z`} fill={red} />
      <text x={sx(4.68)} y={sy(1.2)} fontSize={9} fill={red}>
        long fetch
      </text>
      <text x={sx(4.68)} y={sy(1.2) + 11} fontSize={9} fill={red}>
        to the south
      </text>
      <text x={sx(3.7)} y={sy(7.25)} fontSize={9} textAnchor="middle" fill={red} fontWeight={700}>
        ships + ferries
      </text>
    </g>
  );
}

export default function M02Hazards({ onScore }: ModuleProps) {
  const [layer, setLayer] = useState(true);
  const [filter, setFilter] = useState<Shown | 'all'>('all');
  const rows = HAZARDS.filter((h) => filter === 'all' || h.shown === filter);
  return (
    <>
      <ChartNotConditions />
      <Section title="The kayaker hazard layer">
        <p>
          A ship worries about depth. A kayak worries about what the water is doing and who cannot see it. Turn the layer on to see which
          features on this fictional chart matter most for a small, slow, low boat.
        </p>
        <div className="legend">
          <button type="button" className="chip" aria-pressed={layer} onClick={() => setLayer((v) => !v)}>
            Kayaker hazard layer: {layer ? 'on' : 'off'}
          </button>
        </div>
        <div className="chart-frame">
          <ChartView overlay={layer ? <HazardOverlay /> : null} ariaLabel="Fictional chart with kayaker hazard layer" />
        </div>
      </Section>

      <Section title="What the chart shows, and what it cannot">
        <div className="legend" role="group" aria-label="Filter hazards">
          {(['all', 'on', 'partly', 'off'] as const).map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {k === 'all' ? 'All hazards' : label[k]}
            </button>
          ))}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hazard</th>
                <th>On chart?</th>
                <th>What the chart gives you</th>
                <th>What else you need</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.name}>
                  <td>
                    <strong>{h.name}</strong>
                  </td>
                  <td>
                    <span className={`badge ${h.shown}`}>{label[h.shown]}</span>
                  </td>
                  <td>{h.chart}</td>
                  <td>{h.need}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="The other sources">
        <div className="table-wrap">
          <table>
            <tbody>
              {SOURCES.map(([n, d]) => (
                <tr key={n}>
                  <th scope="row" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.9rem', color: 'var(--fg)' }}>
                    {n}
                  </th>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'Can the chart tell you how fast the current will run past Gull Point at 2 pm Saturday?',
            options: ['Yes, from the soundings', 'Yes, from the contour spacing', 'No: you need tidal current predictions', 'Yes, from the compass rose'],
            answer: 2,
            why: 'Charts are static. Current speed and timing come from current predictions (and they are still only predictions).',
          },
          {
            q: 'Wind blowing against a strong ebb current over a shoal most likely produces…',
            options: ['Flat water', 'Steep, breaking waves', 'Fog', 'A minus tide'],
            answer: 1,
            why: 'Wind against current steepens waves, and shoaling makes them steeper still.',
          },
          {
            q: 'A "lee shore" is…',
            options: ['A sheltered shore you are protected by', 'The shore the wind blows onto', 'A ferry landing', 'A drying area'],
            answer: 1,
            why: 'Wind and waves push you toward a lee shore, so landing and escape there are hardest.',
          },
        ]}
      />
    </>
  );
}
