# Source brief (from Tim, 2026-10-06)

This is the original request that seeded `spec.md`. It is kept for traceability. Where the two
disagree, `spec.md` wins.

Build a polished, interactive educational tool that teaches an intelligent beginner sea kayaker to
read and navigate with a **paper nautical / marine chart** in the Pacific Northwest, especially
Puget Sound and the Salish Sea. The reader already paddles but wants to be genuinely competent at
traditional chart navigation rather than memorising symbols. Visual, interactive, and practical:
diagrams, simplified chart excerpts drawn for the app, mini-exercises, calculators, hover/click
explanations, and short quizzes.

## Hard requirements

- Do not invent NOAA symbols or navigation rules.
- Distinguish universal concepts from those that vary by chart, edition, datum, location, or year.
- Focus on U.S./NOAA-style charts and Pacific Northwest navigation.
- Magnetic variation varies by location and year. It comes from the chart compass rose or a current
  authoritative geomagnetic source. Never hard-code a permanent declination for Seattle.
- Safety implications are explained specifically for **sea kayakers**.

## Sections

1. **Orientation — what am I looking at?** A clickable simplified chart. For each feature (land and
   water colours, shoreline, soundings, contours, drying/intertidal areas, rocks, reefs, shoals,
   ledges, wrecks/obstructions, kelp, channels, buoys, daymarks, lights, lighthouses, ranges,
   landmarks, bridges, cables/pipelines, restricted/prohibited/caution areas, anchorages, ferry
   routes, TSS, separation zones, shipping lanes, compass rose, lat/long grid, chart datum, scale,
   notes and warnings), explain (A) what it means, (B) what it looks like, and (C) why a kayaker
   cares.
2. **Sea-kayaking hazards.** A kayaker hazard layer covering shipping lanes, ferries, TSS crossings,
   blind corners and narrow channels, strong tidal currents, acceleration around points, tide rips,
   overfalls, standing waves, eddy lines, shoals, submerged and drying rocks, reefs, surf zones, lee
   shores, exposed crossings, fetch, wind against current, fog, cold-water immersion, limited
   landings, steep shorelines, and ferry terminals. State which hazards are on the chart and which
   need other sources (tide/current predictions, forecasts, Coast Pilot, LNM, VTS/AIS, local
   knowledge). Make it very clear that a chart does not give current speed or sea state at a moment.
3. **Measuring distance in nautical miles** (extremely important). 1′ lat = 1 NM. The latitude
   border scale; degrees, minutes, decimal minutes, and subdivisions; 60′ = 1°; 1 NM = 1.852 km ≈
   1.1508 statute miles. A dividers walkthrough: span, move to the latitude scale at roughly the
   route's latitude, and read minutes as NM. Why latitude and not longitude: meridians converge, and
   1′ lon ≈ cos φ NM, about 0.67 NM near 47–48° N. An interactive example at 47.5° N
   (1′ lat ≈ 1 NM, 1′ lon ≈ 0.68 NM). A calculator taking latitude, Δlat, and Δlon. On a paper
   Mercator chart, use the nearby latitude scale with dividers. Three practice exercises.
4. **True north, magnetic north, and variation** from first principles: why they differ, why the
   difference changes by place and over time, and the two rings of the compass rose. A fictional
   rose such as `VAR 15° E (2025) ANNUAL CHANGE 6′ W`, updated to a later year; 60′ = 1°.
   Mathematical convention: East is positive, West is negative. Magnetic = True − Var and
   True = Mag + Var. Worked examples: 15° E with T 270° gives M 255°; 15° W with T 270° gives
   M 285°. A True ↔ Magnetic calculator, normalised to 000–359°.
5. **Pacific Northwest variation.** Substantial easterly variation whose exact number depends on
   place and date. Get it from the compass rose, the reference year, the annual change, and an
   up-to-date calculator. Update an old rose to the present. Warning: "Do not assume a remembered
   Seattle magnetic variation is permanently correct." Printed charts become outdated.
6. **Deviation vs. variation.** Deviation is error from the boat and its gear: deck compass
   placement, phones, watches, speakers, knives and tools, magnetic clasps, batteries and
   electronics, and testing after mounting gear. TRUE → (variation) → MAGNETIC → (deviation) →
   COMPASS. Most kayakers work True ↔ Magnetic unless they have measured deviation.
7. **Taking and plotting a course.** A to B: course line, parallel rules / plotter / compass rose,
   true course, apply variation, magnetic course, steer it. Reverse: an observed magnetic bearing
   converted to true and plotted. Several worked examples.
8. **Position by latitude and longitude.** Degrees, minutes, decimal minutes, N/S, E/W, and plotting
   a GPS fix. Exercise: click the position a coordinate describes.
9. **Depth and tides.** Soundings are relative to chart datum, not today's depth. Actual ≈ charted +
   height of tide, with its limitations. Units may be feet, fathoms, or metres, so check the chart;
   1 fathom = 6 ft; how to find the units.
10. **Lights and aids.** Fl, Q, Oc, Iso, R, G, W, and period, with examples such as `Fl R 4s` broken
    apart. U.S. red/green lateral aids, understood as a system rather than as "red right returning".
11. **Traffic Separation Schemes.** Inbound and outbound lanes, the separation zone, arrows, and
    precautionary areas. Crossing roughly perpendicular to traffic when safe, keeping a strong
    lookout, and not impeding vessels using the scheme. Not a substitute for COLREGS training.
12. **Pre-departure chart check.** A checklist covering route (distance, true and magnetic course),
    water (depths, shoals, rocks, landings), currents (predictions, direction, max, slack), traffic
    (ferries, lanes, crossings), weather (wind, visibility, forecast, fetch, wind vs. current),
    escape options (alternate landings, bailouts), and navigation gear (chart, compass, GPS backup,
    VHF, position awareness).
13. **Final exercise.** A fictional Puget-Sound-style chart with mainland, an island, a 3 NM crossing,
    a shoal, a rock, a flashing buoy, a TSS, a ferry route, a compass rose, lat/long scales, and
    contours. Mission A → B: (1) distance, (2) true bearing, (3) magnetic bearing, (4) largest
    hazards, (5) whether the route crosses a shipping lane, (6) bailout options, and (7) information
    still needed. Answer first, then reveal.

**Design.** A "Marine Chart Navigation Academy" feel: clean nautical styling in chart beige, blue,
and magenta; responsive; tabs/modules, hover definitions, calculators, diagrams, quizzes,
progressive disclosure, tooltips, and worked examples. Priorities: (1) practical kayak navigation,
(2) distance, (3) true vs. magnetic, (4) Puget Sound hazards, (5) symbols.

**Cheat sheet.** 1′ lat = 1 NM; 60′ = 1°; 1 NM = 1.852 km; 1 NM ≈ 1.151 st mi; M = T − V;
T = M + V; E positive, W negative; use the latitude scale; chart ≠ current conditions; check tides,
currents, weather, traffic, and notices separately.
