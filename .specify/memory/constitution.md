<!--
Sync Impact Report
- Version change: (template) → 1.0.0 (initial ratification)
- Principles defined: I–VIII (all new)
- Added sections: Core Principles, Content Standards, Development Workflow, Governance
- Removed sections: none
- Templates: ✅ plan-template.md (Constitution Check is filled from this file at plan time;
  no edit needed) · ✅ spec-template.md (no new mandatory sections) · ✅ tasks-template.md
  (test tasks already supported; Principle VII makes them mandatory for src/lib/nav)
- Deferred TODOs: none
-->

# Salish Nav Academy Constitution

## Core Principles

### I. Accuracy Over Invention

The app MUST NOT invent NOAA chart symbols, abbreviations, or navigation rules. U.S. Chart No. 1
is the reference for symbology, and IALA Region B for U.S. buoyage. Where the exact appearance of a
glyph cannot be verified, the app MUST describe the concept in words, and any drawing MUST be
labelled "simplified illustration" rather than presented as the official symbol.
_Rationale:_ a learner trusts what they are shown, and a wrong symbol is worse than no symbol.

### II. Universal vs. Variable

Every module MUST distinguish what is universal (1′ of latitude = 1 NM, Magnetic = True −
Variation) from what varies by chart, edition, datum, location, or year (depth units, variation,
datum, light characteristics of a specific aid).
_Rationale:_ beginners over-generalise from examples. The distinction is the lesson.

### III. No Permanent Magnetic Variation

The app MUST NOT present any hard-coded magnetic variation as the real value for a real place.
Worked examples MUST use compass roses that are clearly labelled as fictional. The app MUST teach
that real values come from the chart's compass rose, updated with its annual change, or from a
current authoritative source such as the NOAA NCEI declination calculator.
_Rationale:_ variation changes over time and place, and a remembered number becomes wrong.

### IV. Kayaker-Specific Safety, Honest Scope

Safety guidance MUST be framed for small, slow, low-profile, human-powered craft. The app MUST NOT
claim to replace COLREGS training, a navigation course, official publications (Coast Pilot, Local
Notice to Mariners), or local knowledge, and it MUST say so wherever rules of the road are taught.

### V. A Chart Is Not Current Conditions

Any module touching hazards, currents, depth, traffic, or trip planning MUST state that the static
chart does not give current speed, sea state, weather, or traffic at a given moment, and MUST name
the separate sources that do.

### VI. Learn by Doing

Concepts are taught through interaction (clickable charts, calculators, worked examples, quizzes
that are answered before the solution is revealed), with prose kept concise enough to scan.
Progressive disclosure is used for depth.

### VII. Tested Pure Math (NON-NEGOTIABLE)

All navigation calculations (distance, bearing conversion, variation update, coordinate parsing,
depth, light notation) MUST live as pure functions in `src/lib/nav/`, with unit tests that include
the brief's worked examples and edge cases (wrap-around at 000°/360°, negative inputs). UI code
MUST call these functions and MUST NOT re-implement them.

### VIII. Accessible and Portable

The app MUST work at phone width (≥ 320px) without horizontal page scrolling. It MUST be operable
by keyboard, support light and dark themes, and use a nautical-chart visual language. It MUST
ship as a single static HTML file with no backend and no runtime network dependency.

## Content Standards

- Unit conversions use exact definitions: 1 NM = 1.852 km, 1 NM ≈ 1.1508 statute miles, and
  1 fathom = 6 ft.
- Bearings are shown as three digits (e.g. `005°`) and normalised to 000°–359°.
- Every fictional chart, place, and compass rose is labelled "fictional — not for navigation".

## Development Workflow

- Non-trivial features go through Spec Kit: specify → clarify → plan → tasks → analyze → implement.
- `npm run check` (typecheck, lint, tests, build) MUST pass before every push.
- One branch and one pull request per feature.

## Governance

This constitution supersedes other practice in this repo. Amendments are made by pull request
editing this file, with a semantic version bump: MAJOR for removing or redefining a principle,
MINOR for adding one, PATCH for wording. Every plan's Constitution Check gates against I–VIII,
and review verifies compliance. Runtime agent guidance lives in `CLAUDE.md`.

**Version**: 1.0.0 | **Ratified**: 2026-10-06 | **Last Amended**: 2026-10-06
