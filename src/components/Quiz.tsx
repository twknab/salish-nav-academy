import { useState } from 'react';

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export function Quiz({ questions, onScore, title = 'Check yourself' }: { questions: QuizQuestion[]; onScore?: (fraction: number) => void; title?: string }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === questions[i]?.answer).length;

  const choose = (qi: number, oi: number) => {
    if (picked[qi] !== null) return;
    const next = picked.map((p, i) => (i === qi ? oi : p));
    setPicked(next);
    if (next.every((p) => p !== null)) {
      const score = next.filter((p, i) => p === questions[i]?.answer).length / questions.length;
      onScore?.(score);
    }
  };

  return (
    <div className="panel quiz">
      <div className="panel-title">{title}</div>
      {questions.map((qq, qi) => {
        const p = picked[qi] ?? null;
        return (
          <div className="q" key={qi}>
            <div className="q-prompt">
              {qi + 1}. {qq.q}
            </div>
            <div className="opts">
              {qq.options.map((o, oi) => {
                const cls = p === null ? '' : oi === qq.answer ? ' right' : oi === p ? ' wrong' : '';
                return (
                  <button key={oi} type="button" className={`opt${cls}`} disabled={p !== null} onClick={() => choose(qi, oi)}>
                    {o}
                  </button>
                );
              })}
            </div>
            {p !== null ? (
              <div className="why" aria-live="polite">
                <strong>{p === qq.answer ? 'Correct.' : 'Not quite.'}</strong> {qq.why}
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="score" aria-live="polite">
        {answered === questions.length ? `Score: ${correct} / ${questions.length}` : `${answered} of ${questions.length} answered`}
        {answered > 0 ? (
          <>
            {' '}
            <button type="button" className="btn ghost" style={{ marginLeft: 8 }} onClick={() => setPicked(questions.map(() => null))}>
              Reset quiz
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
