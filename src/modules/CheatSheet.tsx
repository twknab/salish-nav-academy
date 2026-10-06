const CARDS: { title: string; lines: string[]; formula?: boolean }[] = [
  { title: 'Distance', formula: true, lines: ['1′ latitude = 1 NM', '60′ = 1°', '1 NM = 1.852 km', '1 NM ≈ 1.151 statute mi'] },
  { title: 'Measure on the LATITUDE scale', lines: ['Dividers → side border, beside your route.', '1′ longitude ≈ cos(lat) NM ≈ 0.68 NM at 47.5° N. It is not a mile ruler.'] },
  { title: 'Bearings', formula: true, lines: ['Magnetic = True − Variation', 'True = Magnetic + Variation', 'East variation = +', 'West variation = −', 'Normalize to 000°–359°'] },
  { title: 'Variation', lines: ['From the rose nearest your route.', 'Update: rose value + annual change × years (60′ = 1°).', 'Cross-check a current NOAA NCEI calculator.', 'Never trust a remembered number.'] },
  { title: 'Depth', lines: ['Depth now ≈ charted + height of tide.', 'Datum: MLLW on U.S. tidal charts.', 'Underlined = drying height.', 'Units: check the title block. 1 fathom = 6 ft.'] },
  { title: 'Lights', lines: ['Fl flashing · Q quick · Iso equal · Oc mostly on · F fixed', 'R red · G green · W white', '4s = period. Time it.'] },
  { title: 'TSS', lines: ['Do not impede ships in the lanes.', 'Heading ≈ 90° to traffic, at the narrowest point.', 'Tight group, keep moving, never stop in the scheme.'] },
  {
    title: 'Chart ≠ current conditions',
    lines: ['Check separately: tides, currents, weather, traffic, notices (LNM), visibility, water temperature.'],
  },
];

export default function CheatSheet() {
  return (
    <>
      <p className="chart-caption no-print">
        This page prints on one page in black and white: use your browser&apos;s print command when the app is open as a file. Inside some
        viewers printing is unavailable.
      </p>
      <div className="cheat">
        {CARDS.map((c) => (
          <div key={c.title} className="panel">
            <h3>{c.title}</h3>
            <ul style={{ listStyle: c.formula ? 'none' : undefined, paddingLeft: c.formula ? 0 : undefined }}>
              {c.lines.map((l) => (
                <li key={l} className={c.formula ? 'formula' : undefined}>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="chart-caption">Salish Nav Academy · a trainer, not a chart · not a substitute for COLREGS training or a navigation course.</p>
    </>
  );
}
