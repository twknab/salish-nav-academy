import { useCallback, useEffect, useState } from 'react';
import { type Progress, loadProgress, saveProgress } from './lib/progress';
import { MODULES } from './modules/registry';

const GROUPS = ['Read the chart', 'Direction & distance', 'On the water', 'Put it together'] as const;

function currentId(): string {
  const h = window.location.hash.replace('#', '');
  return MODULES.some((m) => m.id === h) ? h : 'orientation';
}

export default function App() {
  const [id, setId] = useState(currentId);
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    const onHash = () => setId(currentId());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    setProgress((p) => (p.visited.includes(id) ? p : { ...p, visited: [...p.visited, id] }));
  }, [id]);

  useEffect(() => saveProgress(progress), [progress]);

  const go = (next: string) => {
    setId(next);
    try {
      history.replaceState(null, '', `#${next}`);
    } catch {
      /* sandboxed frames may refuse; state still updates */
    }
    window.scrollTo({ top: 0 });
  };

  const onScore = useCallback(
    (fraction: number) =>
      setProgress((p) => ({ ...p, quizBest: { ...p.quizBest, [id]: Math.max(p.quizBest[id] ?? 0, fraction) } })),
    [id],
  );
  const setCheck = useCallback((key: string, value: boolean) => setProgress((p) => ({ ...p, checklist: { ...p.checklist, [key]: value } })), []);

  const idx = MODULES.findIndex((m) => m.id === id);
  const mod = MODULES[idx]!;
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];
  const quizzes = MODULES.filter((m) => m.hasQuiz);
  const passed = quizzes.filter((m) => (progress.quizBest[m.id] ?? 0) >= 0.75).length;
  const Mod = mod.Component;

  return (
    <div className="shell">
      <aside className="rail" aria-label="Modules">
        <div className="brand">
          <span className="brand-name">Salish Nav Academy</span>
          <span className="brand-sub">Paper-chart navigation for sea kayakers</span>
        </div>
        {GROUPS.map((g) => (
          <div key={g}>
            <div className="rail-group">{g}</div>
            <nav>
              {MODULES.filter((m) => m.group === g).map((m) => {
                const best = progress.quizBest[m.id];
                return (
                  <button key={m.id} type="button" className="rail-link" aria-current={m.id === id ? 'page' : undefined} onClick={() => go(m.id)}>
                    <span className="rail-num">{m.num}</span>
                    <span>{m.title}</span>
                    <span className="rail-tick" aria-label={best !== undefined ? `best quiz score ${Math.round(best * 100)} percent` : undefined}>
                      {best !== undefined ? `${Math.round(best * 100)}%` : progress.visited.includes(m.id) ? '·' : ''}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
        <p className="rail-progress">
          {passed} of {quizzes.length} quizzes at 75%+. Progress is saved on this device only.
        </p>
      </aside>

      <div className="mobile-nav">
        <label htmlFor="mnav" className="brand-sub">
          Salish Nav Academy · module
        </label>
        <select id="mnav" value={id} onChange={(e) => go(e.target.value)}>
          {MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.num} · {m.title}
              {progress.quizBest[m.id] !== undefined ? ` (${Math.round(progress.quizBest[m.id]! * 100)}%)` : ''}
            </option>
          ))}
        </select>
      </div>

      <main className="main">
        <article className="sheet" key={mod.id}>
          <header className="mod-head">
            <span className="eyebrow">
              {mod.num === '✦' ? 'Reference' : `Module ${mod.num}`} · {mod.group}
            </span>
            <h2>{mod.title}</h2>
            <p className="lede">{mod.lede}</p>
          </header>
          <Mod onScore={onScore} progress={progress} setCheck={setCheck} />
          <nav className="pager" aria-label="Module navigation">
            {prev ? (
              <button type="button" className="btn ghost" onClick={() => go(prev.id)}>
                ← {prev.title}
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button type="button" className="btn" onClick={() => go(next.id)}>
                {next.title} →
              </button>
            ) : null}
          </nav>
          <p className="footer-note">
            A trainer, not a chart. All charts, roses and places here are fictional and not for navigation. This is not a substitute for
            COLREGS training, a navigation course, NOAA charts and U.S. Chart No. 1, the Coast Pilot, Local Notices to Mariners, or current
            tide, current and weather information.
          </p>
        </article>
      </main>
    </div>
  );
}
