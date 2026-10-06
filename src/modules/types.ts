import type { Progress } from '../lib/progress';

export interface ModuleProps {
  onScore: (fraction: number) => void;
  progress: Progress;
  setCheck: (id: string, value: boolean) => void;
}

export const THIS_YEAR = new Date().getFullYear();
