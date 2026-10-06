# Salish Nav Academy

An interactive trainer for **paper-chart navigation for sea kayakers** in Puget Sound and the
Salish Sea. It has 13 modules and a printable cheat sheet: chart symbols, kayak-specific hazards,
measuring nautical miles on the latitude scale, true vs. magnetic bearings, Pacific Northwest
variation, deviation, plotting courses and bearing fixes, lat/long, depth and tides, lights, Traffic
Separation Schemes, a pre-departure checklist, and a final A→B exercise on a fictional chart.

> A trainer, not a chart. Every chart, compass rose and place in the app is **fictional and not for
> navigation**. It is not a substitute for COLREGS training, a navigation course, NOAA charts and
> U.S. Chart No. 1, the Coast Pilot, Local Notices to Mariners, or current tide, current and weather
> information.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run check      # typecheck, lint, tests, single-file build
npm run artifact   # build + dist/artifact.html (body-only page for publishing as an Artifact)
```

`npm run build` produces **one self-contained `dist/index.html`**. Open it straight from disk. It
needs no network access.

## How it is built

- Vite + React + TypeScript (strict), with no UI framework.
- `src/lib/nav/`: all navigation math as pure, unit-tested functions (distance, bearings,
  variation, coordinates, depth, light notation).
- `src/chart/`: one fictional chart model, rendered as SVG and reused by every module.
- `src/modules/`: one component per module, plus `registry.ts`.
- Progress (quiz bests and checklist ticks) stays in `localStorage` on the device only.

## Process

Built with Spec Kit. See `.specify/memory/constitution.md` and `specs/001-chart-academy/` (brief,
spec, plan, tasks).

## Roadmap

- **Feature 2: Float plan builder.** Turn a planned route into a float plan to leave with someone
  ashore.
- Possible integration of parts of this into RoamGuru.
