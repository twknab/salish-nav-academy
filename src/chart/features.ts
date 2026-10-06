/**
 * What each chart feature means, what it looks like, and why a sea kayaker cares.
 * "Looks like" describes U.S. (NOAA) conventions from U.S. Chart No. 1 in words; the drawings
 * on the training chart are simplified illustrations of those conventions, not reproductions.
 */

export type FeatureGroup = 'Water & depth' | 'Hazards' | 'Aids to navigation' | 'Traffic & areas' | 'Reference';

export interface ChartFeature {
  id: string;
  name: string;
  group: FeatureGroup;
  means: string;
  looks: string;
  why: string;
  /** Present when the detail changes by chart, edition, datum, place or year. */
  varies?: string;
  /** True when the feature is drawn (and clickable) on the training chart. */
  onChart: boolean;
}

export const FEATURES: ChartFeature[] = [
  // ---------- water & depth ----------
  {
    id: 'colors',
    name: 'Land and water colours',
    group: 'Water & depth',
    means: 'Colour separates land, ground that dries at low tide, shallow water and deeper water.',
    looks: 'Land is buff/tan. Shallow water is tinted blue. Deeper water is white. Areas that cover and uncover with the tide are green.',
    why: 'Blue is where a kayak can paddle but bigger boats cannot, and where waves steepen and break. White is where ships go and where wind and current have room to build.',
    varies: 'Which depth the blue tint stops at is chosen per chart. Read the legend on your chart.',
    onChart: true,
  },
  {
    id: 'shoreline',
    name: 'Shoreline',
    group: 'Water & depth',
    means: 'The charted coastline. On U.S. charts it is normally the line of Mean High Water.',
    looks: 'A firm black line between the buff land and the water or green drying area.',
    why: 'At a low tide the water\'s edge can be hundreds of feet seaward of that line, across mud, rock or boulder. Your landing spot may look very different from the chart.',
    onChart: true,
  },
  {
    id: 'soundings',
    name: 'Soundings',
    group: 'Water & depth',
    means: 'Measured depths at chart datum (on U.S. tidal charts, Mean Lower Low Water).',
    looks: 'Small numbers scattered across the water.',
    why: 'They show where the bottom shoals, which tells you where waves will stand up and where current speeds up.',
    varies: 'Units may be feet, fathoms or metres. The title block says which. Never assume.',
    onChart: true,
  },
  {
    id: 'contours',
    name: 'Depth contours',
    group: 'Water & depth',
    means: 'Lines joining points of equal depth.',
    looks: 'Thin lines following the shore, often labelled with their depth. On this excerpt they are at 30 and 60 ft.',
    why: 'Contours bunched close together mean a steep bottom. A sudden shoal in a current can kick up rips and standing waves.',
    varies: 'Which contour depths are drawn differs between charts.',
    onChart: true,
  },
  {
    id: 'drying',
    name: 'Drying / intertidal areas',
    group: 'Water & depth',
    means: 'Ground that is covered at high water and exposed at low water.',
    looks: 'Green tint. Underlined numbers inside it are drying heights above chart datum, not depths.',
    why: 'A landing that is a beach at high tide can be a long carry across mud or slippery rock at low. A drying area can also strand you on a falling tide.',
    onChart: true,
  },
  {
    id: 'kelp',
    name: 'Kelp',
    group: 'Water & depth',
    means: 'A bed of seaweed that reaches the surface.',
    looks: 'A wavy symbol and/or the word "Kelp".',
    why: 'Kelp often marks rocky, shallow bottom. It can foul a rudder or skeg, and it also damps swell, which makes it a useful calm-water refuge.',
    varies: 'Kelp beds move with the seasons and years. The chart shows where it was surveyed.',
    onChart: true,
  },
  // ---------- hazards ----------
  {
    id: 'rock-sunken',
    name: 'Submerged rock',
    group: 'Hazards',
    means: 'A rock that stays under water at chart datum but is dangerous to surface navigation.',
    looks: 'A small cross (+), often inside a dotted danger line when it is isolated.',
    why: 'In swell it can break unexpectedly (a "boomer"). Give it more room than its size suggests.',
    onChart: true,
  },
  {
    id: 'rock-drying',
    name: 'Rock that covers and uncovers',
    group: 'Hazards',
    means: 'A rock exposed at some stages of the tide and covered at others.',
    looks: 'An asterisk-like symbol, sometimes with its drying height underlined in brackets.',
    why: 'Near the surface, it is the rock most likely to be hit, or to cause a capsize in breaking water.',
    onChart: true,
  },
  {
    id: 'reef',
    name: 'Reefs and ledges',
    group: 'Hazards',
    means: 'Extended areas of rock near the surface.',
    looks: 'Clusters of rock symbols, often inside a dotted danger line, sometimes labelled "Ledge" or "Reef".',
    why: 'They create breaking water in swell and wakes, and confused currents. They are also fun to rock-garden, but only with skills and conditions to match.',
    onChart: false,
  },
  {
    id: 'shoal',
    name: 'Shoal',
    group: 'Hazards',
    means: 'A shallow area surrounded by deeper water.',
    looks: 'Small soundings and a shallow contour, often blue-tinted and sometimes named.',
    why: 'On a shoal, waves steepen and current accelerates. With wind against tide, a shoal is where the worst water is.',
    onChart: true,
  },
  {
    id: 'wreck',
    name: 'Wrecks and obstructions',
    group: 'Hazards',
    means: 'A sunken vessel ("Wk") or other obstruction ("Obstn") on the bottom.',
    looks: 'The abbreviation "Wk" or "Obstn", or a wreck symbol, often inside a dotted danger line.',
    why: 'They rarely threaten a kayak in deep water, but in shallows they can be just under the surface. Fishing boats may also work around them.',
    onChart: true,
  },
  // ---------- aids ----------
  {
    id: 'buoy',
    name: 'Buoys',
    group: 'Aids to navigation',
    means: 'Floating aids anchored to the bottom that mark channels, hazards or areas.',
    looks: 'A small diamond-shaped symbol with a position circle, coloured for the buoy, labelled with its colour, number and light.',
    why: 'Buoys confirm your position and warn of shallow water. Moving water tugging at a buoy (it leans and leaves a wake) is a free current gauge.',
    varies: 'The number, colour and light of each buoy are specific to it, and they change. Check Local Notice to Mariners.',
    onChart: true,
  },
  {
    id: 'daybeacon',
    name: 'Daybeacons (daymarks)',
    group: 'Aids to navigation',
    means: 'Fixed, unlit aids on a pile or structure, with a coloured board.',
    looks: 'A small square (green, "SG") or triangle (red, "TR") symbol with a number.',
    why: 'Fixed structures often stand in shallow water near rocks or shoals. Do not paddle between a daybeacon and the hazard it marks.',
    onChart: true,
  },
  {
    id: 'light',
    name: 'Lights',
    group: 'Aids to navigation',
    means: 'A lit aid. Its characteristic (pattern, colour, period) identifies it at night.',
    looks: 'A magenta flare (teardrop) at the aid, with a label such as "Fl G 4s".',
    why: 'In a dusk or night crossing, timing a flash identifies which light you are looking at.',
    varies: 'Characteristics are specific to each light and can change. The Light List is the authority.',
    onChart: true,
  },
  {
    id: 'lighthouse',
    name: 'Lighthouses / major lights',
    group: 'Aids to navigation',
    means: 'A prominent light structure with a longer range.',
    looks: 'A light symbol with a magenta flare and a fuller label: characteristic, height and nominal range (e.g. "Fl W 6s 40ft 9M").',
    why: 'They are excellent bearings for position fixes, and they often stand on exposed points where current and waves are worst.',
    onChart: true,
  },
  {
    id: 'range',
    name: 'Ranges',
    group: 'Aids to navigation',
    means: 'Two marks that line up when you are on a particular line, usually a channel centreline.',
    looks: 'Two aids with a line drawn through them, often labelled with its true bearing.',
    why: 'A range marks where larger vessels will be. For a kayak, any two charted objects that line up make a "natural range" that shows if the current is setting you sideways.',
    onChart: false,
  },
  {
    id: 'landmark',
    name: 'Prominent landmarks',
    group: 'Aids to navigation',
    means: 'Conspicuous objects ashore: tanks, towers, stacks, spires.',
    looks: 'A small position symbol with a label in capitals (e.g. "TANK").',
    why: 'They are ideal targets for a hand-bearing compass fix, and easier to see from a low kayak than a small buoy.',
    onChart: true,
  },
  // ---------- traffic & areas ----------
  {
    id: 'tss',
    name: 'Traffic Separation Scheme (TSS)',
    group: 'Traffic & areas',
    means: 'A one-way road system for large ships: an inbound lane and an outbound lane.',
    looks: 'Magenta lane limits and large outline arrows showing the direction of traffic.',
    why: 'Ships in a TSS are fast, cannot stop or turn quickly, and may not see you. Crossing a TSS is often the most dangerous minute of a Puget Sound crossing.',
    onChart: true,
  },
  {
    id: 'separation-zone',
    name: 'Separation zone',
    group: 'Traffic & areas',
    means: 'The strip between the two lanes that separates opposing traffic.',
    looks: 'A magenta-tinted band between the lanes.',
    why: 'It is not a resting place. Cross it as part of one continuous crossing.',
    onChart: true,
  },
  {
    id: 'ferry',
    name: 'Ferry routes',
    group: 'Traffic & areas',
    means: 'The approximate track of a scheduled ferry.',
    looks: 'A dashed line labelled "Ferry".',
    why: 'Ferries run frequently and fast, with wide wakes, and they manoeuvre near terminals. Know the schedule and do not linger on the line.',
    varies: 'Routes and schedules change, and the line on a chart is approximate.',
    onChart: true,
  },
  {
    id: 'restricted',
    name: 'Restricted / prohibited / caution areas',
    group: 'Traffic & areas',
    means: 'Areas where entry or activity is limited, explained by a chart note or the Coast Pilot.',
    looks: 'A magenta dashed boundary, often with small T-marks, and a label pointing to a note.',
    why: 'Some prohibit entry entirely (security zones, naval areas). Read the note before you plan a route through one.',
    varies: 'The rules live in the note and the Coast Pilot / CFR and change over time.',
    onChart: true,
  },
  {
    id: 'anchorage',
    name: 'Anchorages',
    group: 'Traffic & areas',
    means: 'An area designated for vessels to anchor.',
    looks: 'A magenta dashed boundary with an anchor symbol.',
    why: 'Expect large anchored ships swinging with the current, and the anchor chains and small boats around them.',
    onChart: true,
  },
  {
    id: 'cable',
    name: 'Cables and pipelines',
    group: 'Traffic & areas',
    means: 'Submarine cables or pipelines on the seabed.',
    looks: 'Magenta wavy (cable) or dashed (pipeline) lines, or a dashed "Cable Area" boundary.',
    why: 'Little direct risk to a kayak, but they often land at beaches with private or restricted shore access, and they show why boats will not anchor there.',
    onChart: true,
  },
  {
    id: 'bridge',
    name: 'Bridges',
    group: 'Traffic & areas',
    means: 'A fixed, lift or swing bridge with its vertical clearance.',
    looks: 'The bridge drawn across the water, with a clearance label such as "VERT CL 40 FT".',
    why: 'Narrows under bridges concentrate current and boat traffic. Piers create eddies and strainers.',
    onChart: false,
  },
  // ---------- reference ----------
  {
    id: 'rose',
    name: 'Compass rose',
    group: 'Reference',
    means: 'Two concentric rings for measuring direction. The outer ring is true, the inner ring is magnetic.',
    looks: 'Circles marked 0–360°, with the variation and its year and annual change printed in the middle.',
    why: 'It is your source for this chart\'s magnetic variation, and a protractor for laying off courses.',
    varies: 'Variation differs on every chart and every year. This rose is fictional.',
    onChart: true,
  },
  {
    id: 'grid',
    name: 'Latitude / longitude grid and borders',
    group: 'Reference',
    means: 'The coordinate frame. The side borders are the latitude scale and the top and bottom borders are longitude.',
    looks: 'Black and white bars in the margins, subdivided into minutes and tenths.',
    why: 'The latitude border is your distance ruler: 1′ of latitude = 1 nautical mile. The longitude border is NOT a mile ruler.',
    onChart: true,
  },
  {
    id: 'datum',
    name: 'Chart datum',
    group: 'Reference',
    means: 'The reference levels used by the chart: the vertical datum for soundings (MLLW on U.S. tidal charts) and the horizontal datum for positions (e.g. NAD 83).',
    looks: 'Text in the title block, e.g. "SOUNDINGS IN FEET AT MEAN LOWER LOW WATER".',
    why: 'A sounding is the depth at that low level, not today\'s depth. Your GPS must use the same horizontal datum as the chart to plot correctly.',
    varies: 'Datums differ between older and newer charts and between countries.',
    onChart: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    group: 'Reference',
    means: 'The ratio between chart distance and real distance (e.g. 1:25,000).',
    looks: 'Printed in the title block, often with a bar scale.',
    why: 'Larger-scale charts (e.g. 1:25,000) show the small rocks and coves that matter to a kayak. Small-scale charts leave them out.',
    varies: 'Every chart has its own scale. Mercator distortion also means you measure at the latitude of your route.',
    onChart: true,
  },
  {
    id: 'notes',
    name: 'Chart notes and warnings',
    group: 'Reference',
    means: 'Printed text that explains areas, regulations, cautions and sources.',
    looks: 'Boxed or plain text, often lettered "NOTE A", with magenta for regulatory notes.',
    why: 'The rules for restricted areas, the TSS and local hazards are often only in the notes. Read them before a trip.',
    onChart: true,
  },
];

export const FEATURE_GROUPS: FeatureGroup[] = [
  'Water & depth',
  'Hazards',
  'Aids to navigation',
  'Traffic & areas',
  'Reference',
];

export function featureById(id: string): ChartFeature | undefined {
  return FEATURES.find((f) => f.id === id);
}
