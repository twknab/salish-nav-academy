# Feature Specification: Marine Chart Navigation Academy

**Feature Branch**: `claude/magical-dijkstra-670t80`
**Created**: 2026-10-06
**Status**: Clarified
**Input**: Tim's brief. The full text is in [`brief.md`](./brief.md) and is the content source for
all 13 modules and the cheat sheet.

## Clarifications

### Session 2026-10-06

- Q: Should progress be remembered between visits? → A: Yes, on this device only (module completion
  and best quiz score). Losing it is harmless.
- Q: Should the cheat sheet print? → A: Yes. It prints on one page in a print-optimized black,
  white, and magenta layout.
- Q: Which units do the depth examples use by default? → A: Feet. Fathoms and metres are taught,
  along with how to find a chart's units.
- Q: Should the academy and the float plan builder share one spec? → A: No. The float plan builder
  is Feature 2.

## User Scenarios & Testing *(mandatory)*

The user throughout is **an intelligent beginner sea kayaker in Puget Sound** who wants to navigate
competently with a paper chart and a compass.

### User Story 1 — Measure a route in nautical miles (Priority: P1)

The learner measures the distance between two points on a chart using the latitude scale. They
understand why the longitude border is not a mile ruler, and they can check their reasoning with a
calculator.

**Why this priority**: the brief marks it "extremely important"; every trip plan starts with distance.

**Independent Test**: complete the dividers walkthrough and the 3 practice exercises on the
measuring module alone. The calculator returns 1′ lat ≈ 1.00 NM and 1′ lon ≈ 0.68 NM at 47.5° N.

**Acceptance Scenarios**:

1. **Given** latitude 47.5°, Δlat 1′, Δlon 1′, **When** the learner enters them, **Then** the
   calculator shows N/S ≈ 1.00 NM and E/W ≈ 0.68 NM, plus the straight-line total, in km and
   statute miles.
2. **Given** a practice route, **When** the learner submits a distance within tolerance, **Then**
   it is marked correct and the dividers method is shown. **When** the answer is wrong, the
   explanation names the likely mistake (for example, using the longitude scale).

### User Story 2 — Convert true ↔ magnetic bearings correctly (Priority: P1)

The learner reads a compass rose, updates its variation to the present year using the annual
change, and converts between true and magnetic using signed arithmetic (East +, West −).

**Independent Test**: on the variation modules alone, a true bearing of 270° with variation 15° E
gives magnetic 255°, and with 15° W gives 285°. A fictional 2025 rose reading 15° E with an annual
change of 6′ W gives 14° 30′ E in 2030.

**Acceptance Scenarios**:

1. **Given** any true bearing and variation, **When** the learner converts, **Then** the result is
   shown as three digits normalized to 000–359°, with the arithmetic written out.
2. **Given** a compass rose year, annual change, and target year, **When** the learner computes,
   **Then** the updated variation is shown in degrees and minutes, with the direction.

### User Story 3 — Recognize Puget Sound hazards for a kayak (Priority: P2)

The learner turns on a kayaker hazard layer and learns which hazards the chart shows and which
need other sources.

**Independent Test**: every hazard listed in brief §2 is present and tagged *on the chart* or
*needs other info*, with the specific sources named. A prominent statement says that the chart
does not give current speed or sea state.

### User Story 4 — Read the chart's symbols (Priority: P2)

The learner clicks features on a simplified chart and gets what each one means, what it looks like,
and why a kayaker cares.

**Independent Test**: every feature in brief §1 has those three explanations. Drawn features are
labelled as simplified illustrations.

### User Story 5 — Plot a course, plot a position, read depths and lights (Priority: P3)

Modules 7–10 each have worked examples and an interactive check: plotting a course both ways,
clicking a coordinate on the chart, charted depth plus tide, and parsing light characteristics.

### User Story 6 — Understand TSS, deviation, and pre-trip checks (Priority: P3)

Modules 6, 11, and 12 cover deviation sources specific to kayaks, how to cross a TSS, and a
usable pre-departure checklist whose checkboxes persist.

### User Story 7 — Final exercise and cheat sheet (Priority: P3)

The learner answers all 7 mission questions on the fictional chart **before** the solutions
reveal. The cheat sheet prints on one page.

### Edge Cases

- A bearing calculation that wraps past 360° or below 0°, such as 005° T with 15° E variation,
  gives 350° M.
- An annual change that pushes variation across 0° from East to West.
- A latitude entered as 90° or a negative (southern) latitude: the calculator still behaves, and
  shows a note that the cosine approaches 0 near the poles.
- Invalid or empty input shows an inline message, never NaN.
- Without browser storage (private mode), the app works and progress is not saved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The academy MUST present 13 modules plus a cheat sheet, matching brief §§1–13, and
  navigable in any order.
- **FR-002**: Every chart feature in brief §1 MUST have a "means / looks like / why a kayaker
  cares" explanation, reachable by click or keyboard.
- **FR-003**: The hazard module MUST classify each hazard in brief §2 as shown on the chart or
  needing outside sources, and name those sources.
- **FR-004**: The app MUST provide a distance calculator (latitude, Δlat, Δlon → N/S, E/W, and
  total in NM, km, and statute miles), a dividers walkthrough, and 3 practice exercises.
- **FR-005**: The app MUST provide a True ↔ Magnetic calculator using signed variation and a
  variation-update calculator (rose year, annual change, target year).
- **FR-006**: Variation examples MUST use fictional roses that are labelled as fictional. The PNW
  module MUST include the warning "Do not assume a remembered Seattle magnetic variation is
  permanently correct." and point to NOAA NCEI's declination calculator.
- **FR-007**: The deviation module MUST show TRUE → MAGNETIC → COMPASS and list kayak-specific
  deviation sources.
- **FR-008**: The course module MUST include at least 3 worked examples covering both directions
  (true → magnetic to steer, and observed magnetic → true to plot).
- **FR-009**: The position module MUST teach the degrees/minutes formats and include a
  click-the-coordinate exercise with distance-based feedback.
- **FR-010**: The depth module MUST compute charted depth + height of tide, convert between
  feet, fathoms, and metres, and teach where a chart states its units and datum.
- **FR-011**: The lights module MUST parse and visually break apart light notation (character,
  colour, period), and explain U.S. lateral aids as a system.
- **FR-012**: The TSS module MUST illustrate the lanes, separation zone, and arrows, describe crossing
  practice for kayaks, and include a not-a-substitute-for-COLREGS statement.
- **FR-013**: The pre-departure checklist MUST cover every group in brief §12, and its checks MUST
  persist on the device.
- **FR-014**: The final exercise MUST hold back the solutions until the learner submits answers.
- **FR-015**: Each module MUST have at least one short quiz. Best scores and module completion
  persist on the device.
- **FR-016**: The cheat sheet MUST contain every item in brief "Cheat sheet" and print on one page.
- **FR-017**: All fictional charts MUST carry "Fictional — not for navigation."

### Key Entities

- **Chart model**: a fictional area with a lat/lon frame, land polygons, depth contours,
  soundings, hazards, aids, a TSS, a ferry route, a compass rose, and named points.
- **Chart feature**: id, category, means, looks-like, why-a-kayaker-cares, and an
  on-chart/off-chart flag.
- **Module**: id, title, sections, and a quiz.
- **Quiz question**: prompt, options or a numeric answer with tolerance, and an explanation.
- **Progress**: completed modules, best quiz scores, and checklist ticks.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All worked examples in the brief compute exactly: 270° T with 15° E gives 255° M,
  270° T with 15° W gives 285° M, and 1′ lon at 47.5° gives 0.68 NM.
- **SC-002**: A learner can complete the final mission in under 15 minutes after doing modules 3–4.
- **SC-003**: Every module is usable at 375px width with no horizontal page scroll.
- **SC-004**: Every interactive control is reachable and operable by keyboard alone.
- **SC-005**: The app runs from a single file with no network access.
- **SC-006**: A content review finds no invented symbol or rule, and every drawn symbol is either
  a Chart No. 1 convention or labelled as a simplified illustration.

## Assumptions

- The learner has, or will buy, a real NOAA chart. This app is a trainer, not a chart.
- The fictional chart sits near 47.5° N, 122.5° W so the cosine examples match the region, but it
  depicts no real place.
- Light and aid examples are generic U.S. conventions, not specific real aids.
- English only, with no accounts and no backend.
