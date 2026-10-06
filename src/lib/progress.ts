/** Per-device progress. Storage can be missing (private mode, sandboxed previews), so every
 *  access is guarded and the app works without it. */

const KEY = 'salish-nav-academy:v1';

export interface Progress {
  visited: string[];
  quizBest: Record<string, number>; // module id → best fraction 0..1
  checklist: Record<string, boolean>;
}

const EMPTY: Progress = { visited: [], quizBest: {}, checklist: {} };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      quizBest: parsed.quizBest ?? {},
      checklist: parsed.checklist ?? {},
    };
  } catch {
    return EMPTY;
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: progress simply is not remembered */
  }
}
