import { ChartNotConditions, Section } from '../components/ui';
import type { ModuleProps } from './types';

export const CHECKLIST: { group: string; items: string[] }[] = [
  { group: 'Route', items: ['Distance of each leg (latitude scale)', 'True course of each leg', 'Magnetic course (variation updated to this year)', 'Time per leg at a realistic speed'] },
  { group: 'Water', items: ['Depths along the route and at landings', 'Shoals', 'Rocks: submerged, drying, awash', 'Landing options at the tide you will arrive'] },
  { group: 'Currents', items: ['Tidal current predictions for the nearest stations', 'Current direction during each leg', 'Maximum current and when', 'Slack timing for crossings'] },
  { group: 'Traffic', items: ['Ferry routes and schedules', 'Shipping lanes / TSS on the route', 'Crossing plan: where, heading, hold point'] },
  { group: 'Weather', items: ['Wind forecast (speed, direction, timing)', 'Visibility / fog risk', 'Marine forecast and any advisories', 'Fetch upwind of exposed legs', 'Wind against current on any leg'] },
  { group: 'Escape options', items: ['Alternate landings', 'Bailout points on each leg', 'Turn-back time or turn-back conditions'] },
  { group: 'Navigation', items: ['Paper chart (right scale, current edition) in a case', 'Compass checked with gear loaded', 'GPS backup with spare power', 'VHF radio, charged', 'Float plan left with someone ashore', 'Position awareness: know where you are on the chart at all times'] },
];

export default function M12Checklist({ progress, setCheck }: ModuleProps) {
  const total = CHECKLIST.reduce((a, g) => a + g.items.length, 0);
  const done = CHECKLIST.reduce((a, g) => a + g.items.filter((i) => progress.checklist[`${g.group}:${i}`]).length, 0);
  return (
    <>
      <Section title="Before you launch">
        <p>
          Work through this on the beach or the night before. Your ticks are saved on this device, so you can use it as a reusable trip card.{' '}
          <strong className="data">
            {done} / {total}
          </strong>{' '}
          checked.
        </p>
        <div className="checklist">
          {CHECKLIST.map((g) => (
            <div key={g.group} className="panel check-group">
              <h3>{g.group}</h3>
              {g.items.map((it) => {
                const id = `${g.group}:${it}`;
                const domId = `ck-${id.replace(/[^a-z0-9]+/gi, '-')}`;
                return (
                  <label key={it} className="check" htmlFor={domId}>
                    <input id={domId} type="checkbox" checked={!!progress.checklist[id]} onChange={(e) => setCheck(id, e.target.checked)} />
                    <span>{it}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <div className="pager">
          <button
            type="button"
            className="btn ghost"
            onClick={() => CHECKLIST.forEach((g) => g.items.forEach((it) => setCheck(`${g.group}:${it}`, false)))}
          >
            Clear all ticks for a new trip
          </button>
        </div>
      </Section>
      <ChartNotConditions extra="Half of this list comes from sources other than the chart. That is the point." />
    </>
  );
}
