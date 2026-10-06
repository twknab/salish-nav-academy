import { useState } from 'react';
import { ChartView } from '../chart/ChartView';
import { CHART_TITLE } from '../chart/model';
import { FEATURES, FEATURE_GROUPS, featureById } from '../chart/features';
import { Quiz } from '../components/Quiz';
import { Callout, Section } from '../components/ui';
import type { ModuleProps } from './types';

function FeatureCard({ id }: { id: string | null }) {
  const f = id ? featureById(id) : undefined;
  if (!f) {
    return (
      <div className="panel feature-card">
        <div className="panel-title">Pick something on the chart</div>
        <p>
          Click or tab to any feature on the chart, or choose one from the list below. Each one explains what it means, what it looks like,
          and why it matters from a kayak.
        </p>
      </div>
    );
  }
  return (
    <div className="panel feature-card" aria-live="polite">
      <div className="panel-title">{f.group}</div>
      <h3>{f.name}</h3>
      {!f.onChart ? <span className="badge off">Not on this excerpt</span> : null}
      <div className="triad">
        <div>
          <span>A · What it means</span>
          {f.means}
        </div>
        <div>
          <span>B · What it looks like</span>
          {f.looks}
        </div>
        <div>
          <span>C · Why a sea kayaker cares</span>
          {f.why}
        </div>
      </div>
      {f.varies ? (
        <div className="callout varies">
          <strong>Varies</strong>
          <div>{f.varies}</div>
        </div>
      ) : null}
    </div>
  );
}

export default function M01Orientation({ onScore }: ModuleProps) {
  const [sel, setSel] = useState<string | null>('soundings');
  return (
    <>
      <Section title="The training chart">
        <div className="panel" style={{ gap: 4 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.06em' }}>{CHART_TITLE.name}</div>
          <div className="chart-caption">{CHART_TITLE.sub}</div>
          <div className="data" style={{ fontSize: '0.8rem' }}>
            {CHART_TITLE.datum} · {CHART_TITLE.projection}
          </div>
          <div className="chart-caption" style={{ color: 'var(--accent)' }}>
            {CHART_TITLE.note}
          </div>
        </div>
        <div className="two-col">
          <div className="chart-frame">
            <ChartView onSelect={setSel} selected={sel} ariaLabel="Clickable fictional training chart" />
          </div>
          <FeatureCard id={sel} />
        </div>
        <p className="chart-caption">
          Symbols are simplified illustrations of U.S. Chart No. 1 conventions. For the authoritative symbols, read U.S. Chart No. 1 (free
          from NOAA) alongside a real chart.
        </p>
      </Section>

      <Section title="Every feature, by group">
        {FEATURE_GROUPS.map((g) => (
          <div key={g} className="section" style={{ gap: 6 }}>
            <div className="rail-group" style={{ margin: 0 }}>
              {g}
            </div>
            <div className="legend">
              {FEATURES.filter((f) => f.group === g).map((f) => (
                <button key={f.id} type="button" className="chip" aria-pressed={sel === f.id} onClick={() => setSel(f.id)}>
                  {f.name}
                  {f.onChart ? '' : ' *'}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="chart-caption">* described here, not drawn on this excerpt.</p>
        <Callout title="Read the title block first">
          Before any symbol, read the title block and notes on a real chart. They give the depth units (feet, fathoms or metres), the
          vertical datum, the horizontal datum, the scale, and the edition date. Everything else depends on them.
        </Callout>
      </Section>

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'A green-tinted area along a beach means…',
            options: ['Park land', 'Ground that covers and uncovers with the tide', 'Kelp', 'Fresh water'],
            answer: 1,
            why: 'Green is the intertidal (drying) area. Underlined figures in it are drying heights.',
          },
          {
            q: 'A small "+" inside a dotted circle in the water is…',
            options: ['A buoy', 'A submerged rock dangerous to navigation', 'A survey mark', 'An anchorage'],
            answer: 1,
            why: 'It marks an underwater rock. The dotted danger line highlights an isolated hazard.',
          },
          {
            q: 'Magenta on a U.S. chart is mostly used for…',
            options: ['Deep water', 'Land features', 'Aids, lights, traffic schemes and regulated areas', 'Depth contours'],
            answer: 2,
            why: 'Magenta draws attention: light flares, TSS, restricted areas, the compass rose.',
          },
          {
            q: 'Where do you find whether soundings are in feet, fathoms or metres?',
            options: ['Assume feet', 'The title block / chart notes', 'The compass rose', 'The legend on your GPS'],
            answer: 1,
            why: 'The title block states the units and the datum. Never assume.',
          },
        ]}
      />
    </>
  );
}
