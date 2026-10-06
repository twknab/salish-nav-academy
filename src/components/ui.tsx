import { type ReactNode } from 'react';

export function Callout({ kind = 'note', title, children }: { kind?: 'note' | 'warn' | 'safety' | 'varies'; title: string; children: ReactNode }) {
  return (
    <div className={`callout ${kind}`} role={kind === 'safety' ? 'note' : undefined}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

/** The recurring reminder required by Constitution V. */
export function ChartNotConditions({ extra }: { extra?: ReactNode }) {
  return (
    <Callout kind="safety" title="A chart is not today's conditions">
      The chart shows where things are. It does not tell you how fast the current is running, what
      the sea state is, what the wind is doing, or where the ships are right now. Get those from
      tide and current predictions, the marine forecast, VTS/AIS and your own eyes.
      {extra ? <> {extra}</> : null}
    </Callout>
  );
}

export function Varies({ children }: { children: ReactNode }) {
  return (
    <Callout kind="varies" title="Varies by chart, place or year">
      {children}
    </Callout>
  );
}

export function Term({ t, children }: { t: string; children: ReactNode }) {
  return (
    <dfn className="term" title={t} tabIndex={0}>
      {children}
    </dfn>
  );
}

export function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section className="section" id={id}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="panel">
      {title ? <div className="panel-title">{title}</div> : null}
      {children}
    </div>
  );
}

export function NumField(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  wide?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="field" htmlFor={props.id}>
      {props.label}
      <input
        id={props.id}
        className={props.wide ? 'wide' : undefined}
        inputMode="decimal"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        aria-describedby={props.suffix ? `${props.id}-sfx` : undefined}
      />
      {props.suffix ? (
        <span id={`${props.id}-sfx`} style={{ fontSize: '0.75rem' }}>
          {props.suffix}
        </span>
      ) : null}
    </label>
  );
}

export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="field">
      {label}
      <div className="seg" role="group" aria-label={label}>
        {options.map((o) => (
          <button key={o.v} type="button" aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Parse a user-entered number; empty or junk → null. */
export function num(s: string): number | null {
  if (s.trim() === '') return null;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function Disclose({ summary, children, open }: { summary: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="disclose" open={open}>
      <summary>{summary}</summary>
      <div>{children}</div>
    </details>
  );
}
