# Salish Nav Academy — Agent Context

## What this is

An interactive "Marine Chart Navigation Academy" that teaches an intelligent beginner sea kayaker
to read and navigate with a **paper NOAA nautical chart** in Puget Sound and the Salish Sea:
symbols, hazards, distance in nautical miles, true vs. magnetic bearings, position, depth and tides,
lights, Traffic Separation Schemes, pre-trip checks, and a final chart exercise.

Feature 1 is the academy. Feature 2, planned next, is a **float plan builder**. Parts of this may
later move into RoamGuru.

## Stack

- Static web app: **Vite + React + TypeScript (strict)**. No backend.
- `vite-plugin-singlefile` builds `dist/index.html` as **one self-contained file**, so it can also
  be published as a shareable Artifact.
- Tests: **Vitest**. All navigation math lives in pure modules under `src/lib/nav/`, with tests.
- `npm run check` runs typecheck, lint, tests, and build. Run it before every push.

## Process

Non-trivial features go through **Spec Kit** (`speckit-guide` skill): constitution → specify →
clarify → plan → tasks → analyze → implement. Artifacts live in `specs/<NNN-feature>/`. The
constitution is `.specify/memory/constitution.md`.

## Accuracy rules (non-negotiable)

- **Do not invent NOAA symbols or navigation rules.** U.S. Chart No. 1 is the reference. If unsure
  of a glyph, describe the concept rather than drawing a made-up symbol.
- **Separate universal concepts from what varies** by chart, edition, datum, location, or year.
- **Never hard-code a magnetic variation** for Seattle or anywhere else as a real value. Examples
  use clearly labelled **fictional** compass roses. Real values come from the chart's compass rose
  plus annual change, or a current authoritative source (NOAA NCEI declination calculator).
- **A chart is not current conditions.** Currents, sea state, weather, and traffic need separate
  sources.
- Safety framing is specific to **sea kayakers**. This is not a substitute for COLREGS training or
  a navigation course.
