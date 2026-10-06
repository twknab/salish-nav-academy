# Implementation Plan: Marine Chart Navigation Academy

**Branch**: `claude/magical-dijkstra-670t80` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

## Summary

A static single-page React app with 13 modules and a cheat sheet. One fictional chart model is
rendered as SVG and reused by the orientation, hazard, position, course, and final-exercise
modules. All navigation math lives in tested pure TypeScript functions. The build produces one
self-contained `dist/index.html`, which is also published as an Artifact.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node 22 for tooling
**Primary Dependencies**: React 18, Vite, `vite-plugin-singlefile`. There is no UI framework or
CSS library, so the visual language is ours.
**Storage**: `localStorage` for progress only, wrapped in try/catch so the app also works
without it.
**Testing**: Vitest for the pure math and data integrity (every feature has its 3 fields, every
quiz has an answer).
**Target Platform**: modern evergreen browsers, from phone to desktop, and print for the cheat
sheet.
**Project Type**: single-project static web app.
**Performance Goals**: first paint from a local file in under 1 s. The bundle is about 300 KB
or less.
**Constraints**: no runtime network access, so no fonts from a CDN and only system font stacks.
**Scale/Scope**: 13 modules and roughly 40 chart features.

## Constitution Check

| Principle | Gate | Status |
| --- | --- | --- |
| I Accuracy | Symbols drawn as simplified illustrations of Chart No. 1 conventions (magenta for aids/lights/restricted areas, soundings in italics, dotted danger circles around rocks). Glyphs are labelled "simplified". | ✅ |
| II Universal vs variable | `FeatureInfo.varies?` field shows a "varies by chart" badge. | ✅ |
| III No permanent variation | Only the fictional rose `VAR 15°00′E (2025) ANNUAL CHANGE 6′W` is used, and the PNW module links NCEI. | ✅ |
| IV Kayaker safety / scope | Disclaimer in the footer and in modules 11 and 13. | ✅ |
| V Chart ≠ conditions | `ChartNotConditions` callout component appears in modules 2, 9, 12, and 13. | ✅ |
| VI Learn by doing | Every module has an interactive element and a quiz. | ✅ |
| VII Tested pure math | `src/lib/nav/*` with `*.test.ts`. The UI imports only from there. | ✅ |
| VIII Accessible/portable | Buttons and SVG features use `tabindex`/`role="button"`, light/dark tokens, single-file build. | ✅ |

## Project Structure

```text
specs/001-chart-academy/   spec.md, plan.md, tasks.md, brief.md, checklists/
src/
  lib/nav/                 distance.ts bearing.ts variation.ts coords.ts depth.ts lights.ts (+ .test.ts)
  lib/progress.ts          safe localStorage wrapper
  chart/                   model.ts (fictional chart data + projection), ChartView.tsx (SVG renderer),
                           features.ts (feature dictionary for module 1/2)
  components/              Quiz.tsx, Callout.tsx, Calc field helpers, Tabs/nav
  modules/                 M01Orientation.tsx … M13FinalExercise.tsx, CheatSheet.tsx, registry.ts
  styles.css               tokens (chart beige / water blue / magenta), light+dark, print
  App.tsx, main.tsx
```

**Structure Decision**: a single project. Content lives in typed data next to each module. The
chart model is shared.

## Key design decisions

- **Projection**: the fictional chart is a Mercator-like rectangle near 47.5° N. Screen x is
  scaled by cos(φ₀) relative to y, so 1′ of longitude is drawn about 0.68 the length of 1′ of
  latitude, just as on a real chart. Learners can see the difference on the borders.
- **Bearing convention**: `magnetic = norm(true − var)` and `true = norm(mag + var)`, with
  East positive. `norm` maps any value into [0, 360).
- **Variation update**: total minutes = var·60 + annualChange·years. The sign of the result
  gives E or W.
- **Distance**: N/S NM = Δlat′. E/W NM = Δlon′·cos(φ). The total is Pythagorean. This is a
  flat-earth approximation that is valid for kayak-scale distances, and the UI says so.
- **Final exercise**: answers are numeric with a tolerance (distance ±0.3 NM, bearing ±5°) or
  multi-select. Solutions are revealed only after submission.

## Complexity Tracking

None. There are no violations.
