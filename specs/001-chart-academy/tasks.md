# Tasks: Marine Chart Navigation Academy

**Input**: `spec.md`, `plan.md` in this directory. Tests are required for `src/lib/nav`
(Constitution VII).

## Phase 1: Setup

- [x] T001 Scaffold Vite + React + TS strict, with `vite-plugin-singlefile`, Vitest, and ESLint, in `package.json`
- [x] T002 Add the `npm run check` script (typecheck, lint, test, build)

## Phase 2: Foundational

- [x] T003 [P] `src/lib/nav/bearing.ts` + tests (normalize, true↔mag, formatting, wrap cases)
- [x] T004 [P] `src/lib/nav/variation.ts` + tests (update by annual change, crossing 0°, formatting)
- [x] T005 [P] `src/lib/nav/distance.ts` + tests (cos-lat, NM↔km/sm, 47.5° example)
- [x] T006 [P] `src/lib/nav/coords.ts` + tests (DDM parse/format, N/S/E/W)
- [x] T007 [P] `src/lib/nav/depth.ts` + tests (charted + tide, ft/fm/m)
- [x] T008 [P] `src/lib/nav/lights.ts` + tests (parse `Fl R 4s`, `Q G`, `Iso W 6s`, `Oc R 4s`, `Fl(2) G 6s`)
- [x] T009 `src/lib/progress.ts` safe storage
- [x] T010 `src/styles.css` tokens, light/dark, print
- [x] T011 `src/chart/model.ts` fictional chart + projection; `ChartView.tsx` SVG layers
- [x] T012 Shared components: Quiz, Callout, ChartNotConditions, app shell with module nav

## Phase 3: US1 Distance (P1) 🎯 MVP

- [x] T013 M03 Measuring: lat scale diagram, dividers walkthrough, why-not-longitude, calculator, 3 exercises, quiz

## Phase 4: US2 Bearings (P1)

- [x] T014 M04 True/Magnetic: first principles, rose rings, update calculator, T↔M calculator, quiz
- [x] T015 M05 PNW variation: sources, old-rose update example, warnings, quiz

## Phase 5: US3–US4 Hazards and symbols (P2)

- [x] T016 `src/chart/features.ts` feature dictionary (means/looks/why/varies), with a data-integrity test
- [x] T017 M01 Orientation: clickable chart + feature list
- [x] T018 M02 Hazards: hazard layer, on-chart vs off-chart table, sources

## Phase 6: US5–US7 (P3)

- [x] T019 M07 Course plotting (3+ worked examples, both directions)
- [x] T020 M08 Position (click-the-coordinate)
- [x] T021 M09 Depth & tides
- [x] T022 M10 Lights & aids
- [x] T023 M11 TSS
- [x] T024 M06 Deviation
- [x] T025 M12 Pre-departure checklist (persisted)
- [x] T026 M13 Final exercise (answer → reveal)
- [x] T027 Cheat sheet (print one page)

## Phase 7: Polish

- [x] T028 Responsive check at 375 px / 1440 px and a keyboard pass (Playwright)
- [x] T029 README, single-file build (Artifact publish happens at release)

## Dependencies

Phase 2 blocks everything. T011 blocks T017, T018, T019, T020, and T026. Modules are otherwise
independent.
