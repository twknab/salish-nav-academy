import { type KeyboardEvent, type MouseEvent, type ReactNode, useId } from 'react';
import {
  ANCHORAGE,
  BAND,
  BUOY,
  CABLE,
  COS,
  DAYBEACON,
  DRYING_LABEL,
  DRYING_ROCK,
  EAST_MAINLAND,
  HEIGHT_NM,
  ISLAND,
  KELP,
  LANDMARK,
  LAT_MINUTES,
  LIGHTHOUSE,
  LON_MINUTES,
  MARGIN,
  OBSTRUCTION,
  POINTS,
  PX,
  RESTRICTED,
  ROSE,
  SHOAL,
  SOUNDINGS,
  SUNKEN_ROCK,
  SVG_H,
  SVG_W,
  TSS,
  WEST_MAINLAND,
  WIDTH_NM,
  WRECK,
  fromSvg,
  path,
  sx,
  sy,
  type Pt,
} from './model';

const INK = 'var(--c-ink)';
const MAG = 'var(--c-magenta)';
const LANDS = [WEST_MAINLAND, ISLAND, EAST_MAINLAND];

export interface ChartViewProps {
  /** Make features clickable and report the chosen id. */
  onSelect?: (id: string) => void;
  selected?: string | null;
  /** Crosshair mode: report the clicked position in NM chart coordinates. */
  onPick?: (pt: Pt) => void;
  /** Drawn above everything, in SVG pixel space (use sx/sy). */
  overlay?: ReactNode;
  /** Show the A and B mission points. */
  showPoints?: boolean;
  ariaLabel?: string;
}

/** A clickable wrapper. Without onSelect it renders plain artwork. */
function Feat(props: {
  id: string;
  label: string;
  onSelect?: (id: string) => void;
  selected?: string | null;
  hit: ReactNode;
  children: ReactNode;
}) {
  const { id, label, onSelect, selected, hit, children } = props;
  if (!onSelect) return <g>{children}</g>;
  const activate = () => onSelect(id);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  };
  return (
    <g
      className={`feat${selected === id ? ' selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected === id}
      onClick={(e) => {
        e.stopPropagation();
        activate();
      }}
      onKeyDown={onKey}
    >
      {children}
      {hit}
    </g>
  );
}

const hitCircle = (p: Pt, r = 14) => (
  <circle className="hit" cx={sx(p[0])} cy={sy(p[1])} r={r} fill="transparent" stroke="transparent" />
);
const hitRect = (x: number, y: number, w: number, h: number) => (
  <rect className="hit" x={x} y={y} width={w} height={h} fill="transparent" stroke="transparent" rx={4} />
);

function Flare({ at, dx = 1, dy = -1 }: { at: Pt; dx?: number; dy?: number }) {
  const x = sx(at[0]);
  const y = sy(at[1]);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <path
      d="M0,0 C6,-4 16,-4 20,0 C16,4 6,4 0,0Z"
      transform={`translate(${x},${y}) rotate(${ang})`}
      fill={MAG}
      fillOpacity={0.85}
    />
  );
}

/** Simplified anchor glyph, drawn rather than typed so no platform turns it into an emoji. */
function Anchor({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`} fill="none" stroke={MAG} strokeWidth={1.2} strokeLinecap="round">
      <circle cx={0} cy={-8} r={2} />
      <line x1={0} y1={-6} x2={0} y2={7} />
      <line x1={-4} y1={-3} x2={4} y2={-3} />
      <path d="M-7,2 Q-6,8 0,7 Q6,8 7,2" />
    </g>
  );
}

function DangerCircle({ at, r = 11 }: { at: Pt; r?: number }) {
  return <circle cx={sx(at[0])} cy={sy(at[1])} r={r} fill="var(--c-shallow)" fillOpacity={0.6} stroke={INK} strokeWidth={0.9} strokeDasharray="1.5 2" />;
}

function BorderScales() {
  const left = MARGIN;
  const right = MARGIN + WIDTH_NM * PX;
  const top = MARGIN;
  const bottom = MARGIN + HEIGHT_NM * PX;
  const out: ReactNode[] = [];
  const bar = 7;
  // Latitude: left and right borders.
  for (let m = 0; m < LAT_MINUTES; m++) {
    const y0 = sy(m + 1);
    for (const x of [left - bar, right]) {
      out.push(<rect key={`lb${m}-${x}`} x={x} y={y0} width={bar} height={PX} fill={m % 2 ? '#fff' : INK} stroke={INK} strokeWidth={0.6} />);
    }
    for (let t = 1; t < 10; t++) {
      const y = sy(m + t / 10);
      const len = t === 5 ? 6 : 3.5;
      out.push(<line key={`lt${m}-${t}`} x1={left - bar - len} x2={left - bar} y1={y} y2={y} stroke={INK} strokeWidth={0.6} />);
      out.push(<line key={`rt${m}-${t}`} x1={right + bar} x2={right + bar + len} y1={y} y2={y} stroke={INK} strokeWidth={0.6} />);
    }
  }
  for (let m = 0; m <= LAT_MINUTES; m++) {
    const total = 27 + m;
    const label = total === 30 ? '47°30′' : `${total}′`;
    out.push(
      <text key={`ll${m}`} x={left - bar - 3} y={sy(m) + 3} fontSize={9} textAnchor="end" fill={INK} fontFamily="var(--font-data)">
        {label}
      </text>,
      <text key={`rl${m}`} x={right + bar + 3} y={sy(m) + 3} fontSize={9} fill={INK} fontFamily="var(--font-data)">
        {label}
      </text>,
    );
  }
  // Longitude: top and bottom borders.
  const minW = COS * PX;
  for (let m = 0; m < LON_MINUTES; m++) {
    const x0 = left + m * minW;
    for (const y of [top - bar, bottom]) {
      out.push(<rect key={`tb${m}-${y}`} x={x0} y={y} width={minW} height={bar} fill={m % 2 ? '#fff' : INK} stroke={INK} strokeWidth={0.6} />);
    }
    for (let t = 1; t < 10; t++) {
      const x = x0 + (t / 10) * minW;
      const len = t === 5 ? 5 : 3;
      out.push(<line key={`tt${m}-${t}`} x1={x} x2={x} y1={top - bar - len} y2={top - bar} stroke={INK} strokeWidth={0.6} />);
      out.push(<line key={`bt${m}-${t}`} x1={x} x2={x} y1={bottom + bar} y2={bottom + bar + len} stroke={INK} strokeWidth={0.6} />);
    }
  }
  for (let m = 0; m <= LON_MINUTES; m += 2) {
    const total = 36 - m;
    const label = m === 0 ? '122°36′W' : `${total}′`;
    const x = left + m * minW;
    out.push(
      <text key={`bl${m}`} x={x} y={bottom + bar + 16} fontSize={9} textAnchor="middle" fill={INK} fontFamily="var(--font-data)">
        {label}
      </text>,
      <text key={`tl${m}`} x={x} y={top - bar - 7} fontSize={9} textAnchor="middle" fill={INK} fontFamily="var(--font-data)">
        {label}
      </text>,
    );
  }
  return <g aria-hidden="true">{out}</g>;
}

export function CompassRose({ cx, cy, r, variation = 15, compact = false }: { cx: number; cy: number; r: number; variation?: number; compact?: boolean }) {
  const ticks: ReactNode[] = [];
  for (let d = 0; d < 360; d += 5) {
    const a = ((d - 90) * Math.PI) / 180;
    const len = d % 30 === 0 ? 8 : d % 10 === 0 ? 5 : 2.5;
    ticks.push(
      <line key={`o${d}`} x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a) * (r - len)} y2={cy + Math.sin(a) * (r - len)} stroke={MAG} strokeWidth={0.8} />,
    );
    if (d % 30 === 0) {
      ticks.push(
        <text key={`ol${d}`} x={cx + Math.cos(a) * (r + 8)} y={cy + Math.sin(a) * (r + 8) + 3} fontSize={7.5} textAnchor="middle" fill={MAG} fontFamily="var(--font-data)">
          {d}
        </text>,
      );
    }
    // inner (magnetic) ring is rotated by the variation: East variation turns it clockwise.
    const b = ((d + variation - 90) * Math.PI) / 180;
    const ri = r * 0.66;
    const leni = d % 30 === 0 ? 6 : d % 10 === 0 ? 3.5 : 0;
    if (leni) {
      ticks.push(
        <line key={`i${d}`} x1={cx + Math.cos(b) * ri} y1={cy + Math.sin(b) * ri} x2={cx + Math.cos(b) * (ri - leni)} y2={cy + Math.sin(b) * (ri - leni)} stroke={MAG} strokeWidth={0.7} />,
      );
    }
    if (d % 90 === 0) {
      ticks.push(
        <text key={`il${d}`} x={cx + Math.cos(b) * (ri - 12)} y={cy + Math.sin(b) * (ri - 12) + 3} fontSize={6.5} textAnchor="middle" fill={MAG} fontFamily="var(--font-data)">
          {d}
        </text>,
      );
    }
  }
  const nT = { x: cx, y: cy - r };
  const nb = ((variation - 90) * Math.PI) / 180;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MAG} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r * 0.66} fill="none" stroke={MAG} strokeWidth={0.8} />
      {ticks}
      <path d={`M${nT.x},${nT.y + 1} l-4,10 l8,0 z`} fill={MAG} />
      <line x1={cx} y1={cy} x2={cx + Math.cos(nb) * r * 0.62} y2={cy + Math.sin(nb) * r * 0.62} stroke={MAG} strokeWidth={1} strokeDasharray="3 2" />
      {!compact && (
        <g fontFamily="var(--font-data)" fill={MAG} textAnchor="middle">
          <text x={cx} y={cy - 4} fontSize={7}>VAR 15°00′E (2025)</text>
          <text x={cx} y={cy + 6} fontSize={7}>ANNUAL CHANGE 6′W</text>
          <text x={cx} y={cy + 17} fontSize={6} fontStyle="italic">fictional</text>
        </g>
      )}
    </g>
  );
}

export function ChartView({ onSelect, selected, onPick, overlay, showPoints, ariaLabel }: ChartViewProps) {
  const clipId = useId().replace(/:/g, '');
  const sel = { onSelect, selected };
  const chartRect = { x: MARGIN, y: MARGIN, w: WIDTH_NM * PX, h: HEIGHT_NM * PX };

  const handlePick = (e: MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = pt.matrixTransform(ctm.inverse());
    const nm = fromSvg(p.x, p.y);
    if (nm[0] < 0 || nm[1] < 0 || nm[0] > WIDTH_NM || nm[1] > HEIGHT_NM) return;
    onPick(nm);
  };

  const band = (w: number, color: string) =>
    LANDS.map((l, i) => <path key={`${color}${w}${i}`} d={path(l)} fill={color} stroke={color} strokeWidth={w * 2 * PX} strokeLinejoin="round" />);
  const contour = (d: number) => [
    ...band(d + 0.012, 'var(--c-contour)'),
  ];

  return (
    <svg
      viewBox={`0 0 ${SVG_W.toFixed(0)} ${SVG_H.toFixed(0)}`}
      role="img"
      aria-label={ariaLabel ?? 'Fictional training chart of a Puget-Sound-style channel. Not a real place.'}
      className={onPick ? 'chart-pick' : undefined}
      onClick={handlePick}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={chartRect.x} y={chartRect.y} width={chartRect.w} height={chartRect.h} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={SVG_W} height={SVG_H} fill="var(--c-deep)" />
      <g clipPath={`url(#${clipId})`}>
        {/* depth bands by stroking the land outlines at increasing offsets */}
        {contour(BAND.line60)}
        {band(BAND.line60, 'var(--c-deep)')}
        {contour(BAND.shallow30)}
        {band(BAND.shallow30, 'var(--c-shallow)')}
        {band(BAND.drying, 'var(--c-drying)')}

        {/* shoal */}
        <Feat id="shoal" label="Shoal" {...sel} hit={<ellipse className="hit" cx={sx(SHOAL.c[0])} cy={sy(SHOAL.c[1])} rx={SHOAL.rx * PX + 6} ry={SHOAL.ry * PX + 6} fill="transparent" stroke="transparent" />}>
          <ellipse cx={sx(SHOAL.c[0])} cy={sy(SHOAL.c[1])} rx={SHOAL.rx * PX + 2} ry={SHOAL.ry * PX + 2} fill="var(--c-shallow)" stroke="var(--c-contour)" strokeWidth={0.8} />
          <text x={sx(SHOAL.c[0]) - 10} y={sy(SHOAL.c[1]) + 3} fontSize={9} fontStyle="italic" fill={INK}>4</text>
          <text x={sx(SHOAL.c[0]) + 6} y={sy(SHOAL.c[1]) - 3} fontSize={9} fontStyle="italic" fill={INK}>7</text>
          <text x={sx(SHOAL.c[0]) + 6} y={sy(SHOAL.c[1]) + 10} fontSize={9} fontStyle="italic" fill={INK}>5</text>
          <text x={sx(SHOAL.c[0])} y={sy(SHOAL.c[1]) + SHOAL.ry * PX + 13} fontSize={8} fontStyle="italic" textAnchor="middle" fill={INK}>Cutter Shoal</text>
        </Feat>

        {/* separation scheme */}
        <Feat id="tss" label="Traffic Separation Scheme lanes" {...sel} hit={hitRect(sx(TSS.westLane[0]), sy(9), (TSS.eastLane[1] - TSS.westLane[0]) * PX, 9 * PX)}>
          {[TSS.westLane[0], TSS.westLane[1], TSS.eastLane[0], TSS.eastLane[1]].map((x) => (
            <line key={x} x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(9)} stroke={MAG} strokeWidth={1} strokeDasharray={x === TSS.westLane[0] || x === TSS.eastLane[1] ? '6 4' : '0'} strokeOpacity={0.9} />
          ))}
          {[1.6, 5.6].map((y) => (
            <g key={`s${y}`}>
              <path d={`M${sx(3.25)},${sy(y + 0.8)} l0,${0.9 * PX} l-7,0 l9,16 l9,-16 l-7,0 l0,${-0.9 * PX}z`} fill="none" stroke={MAG} strokeWidth={1.2} />
              <path d={`M${sx(4.15)},${sy(y - 0.2)} l0,${-0.9 * PX} l-7,0 l9,-16 l9,16 l-7,0 l0,${0.9 * PX}z`} fill="none" stroke={MAG} strokeWidth={1.2} />
            </g>
          ))}
          <text x={sx(3.25)} y={sy(8.7)} fontSize={7.5} textAnchor="middle" fill={MAG} transform={`rotate(-90 ${sx(3.25)} ${sy(8.7)})`}>SOUTHBOUND</text>
          <text x={sx(4.15)} y={sy(8.7)} fontSize={7.5} textAnchor="middle" fill={MAG} transform={`rotate(-90 ${sx(4.15)} ${sy(8.7)})`}>NORTHBOUND</text>
        </Feat>
        <Feat id="separation-zone" label="Separation zone" {...sel} hit={hitRect(sx(TSS.zone[0]), sy(7.4), (TSS.zone[1] - TSS.zone[0]) * PX, 2.4 * PX)}>
          <rect x={sx(TSS.zone[0])} y={sy(9)} width={(TSS.zone[1] - TSS.zone[0]) * PX} height={9 * PX} fill={MAG} fillOpacity={0.16} />
          <text x={sx(3.7)} y={sy(6.4)} fontSize={7} textAnchor="middle" fill={MAG} transform={`rotate(-90 ${sx(3.7)} ${sy(6.4)})`}>SEPARATION ZONE</text>
        </Feat>

        {/* ferry */}
        <Feat id="ferry" label="Ferry route" {...sel} hit={<path className="hit" d={path([POINTS.ferryWest, POINTS.ferryEast], false)} stroke="transparent" strokeWidth={16} fill="none" />}>
          <path d={path([POINTS.ferryWest, POINTS.ferryEast], false)} stroke={INK} strokeWidth={1.1} strokeDasharray="7 4" fill="none" />
          <text x={sx(2.7)} y={sy(6.68)} fontSize={8} fill={INK} transform={`rotate(5 ${sx(2.7)} ${sy(6.68)})`}>Ferry</text>
        </Feat>

        {/* areas */}
        <Feat id="anchorage" label="Anchorage" {...sel} hit={<path className="hit" d={path(ANCHORAGE)} fill="transparent" stroke="transparent" />}>
          <path d={path(ANCHORAGE)} fill="none" stroke={MAG} strokeWidth={1} strokeDasharray="6 3" />
          <Anchor x={sx(2.35)} y={sy(8.1)} />
          <text x={sx(2.35)} y={sy(8.35)} fontSize={7} textAnchor="middle" fill={MAG}>ANCHORAGE</text>
        </Feat>
        <Feat id="restricted" label="Restricted area" {...sel} hit={<path className="hit" d={path(RESTRICTED)} fill="transparent" stroke="transparent" />}>
          <path d={path(RESTRICTED)} fill="none" stroke={MAG} strokeWidth={1.1} strokeDasharray="8 3 1 3" />
          <text x={sx(2.18)} y={sy(1.05)} fontSize={7} textAnchor="middle" fill={MAG}>RESTRICTED AREA</text>
          <text x={sx(2.18)} y={sy(0.85)} fontSize={6.5} textAnchor="middle" fill={MAG}>(see note A)</text>
        </Feat>
        <Feat id="cable" label="Cable area" {...sel} hit={hitRect(sx(CABLE.x1), sy(CABLE.y2) - 6, (CABLE.x2 - CABLE.x1) * PX, (CABLE.y2 - CABLE.y1) * PX + 12)}>
          {[CABLE.y1, CABLE.y2].map((y) => (
            <line key={y} x1={sx(CABLE.x1)} x2={sx(CABLE.x2)} y1={sy(y)} y2={sy(y)} stroke={MAG} strokeWidth={1} strokeDasharray="5 3" />
          ))}
          <text x={sx((CABLE.x1 + CABLE.x2) / 2)} y={sy((CABLE.y1 + CABLE.y2) / 2) + 2.5} fontSize={6.5} textAnchor="middle" fill={MAG}>CABLE AREA</text>
        </Feat>

        {/* soundings */}
        <Feat id="soundings" label="Soundings" {...sel} hit={hitRect(sx(2.95), sy(5.35), 0.7 * PX, 0.4 * PX)}>
          {SOUNDINGS.map(([x, y, d]) => (
            <text key={`${x}-${y}`} x={sx(x)} y={sy(y)} fontSize={9} fontStyle="italic" textAnchor="middle" fill={INK} fontFamily="var(--font-display)">
              {d}
            </text>
          ))}
        </Feat>

        {/* land */}
        {LANDS.map((l, i) => (
          <path key={i} d={path(l)} fill="var(--c-land)" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
        ))}
        <Feat id="shoreline" label="Shoreline" {...sel} hit={hitCircle([1.5, 5.6], 16)}>
          <text x={sx(0.65)} y={sy(4.6)} fontSize={10} fill={INK} fontFamily="var(--font-display)" letterSpacing={1}>MAINLAND</text>
        </Feat>
        <Feat id="colors" label="Land and water colours" {...sel} hit={hitCircle([5.7, 4.6], 20)}>
          <text x={sx(5.7)} y={sy(4.75)} fontSize={9.5} textAnchor="middle" fill={INK} fontFamily="var(--font-display)" letterSpacing={0.8}>HERON</text>
          <text x={sx(5.7)} y={sy(4.55)} fontSize={9.5} textAnchor="middle" fill={INK} fontFamily="var(--font-display)" letterSpacing={0.8}>ISLAND</text>
        </Feat>
        <text x={sx(1.95)} y={sy(4.22)} fontSize={7.5} fill={INK} fontStyle="italic" textAnchor="end">Gull Pt</text>

        <Feat id="contours" label="Depth contours" {...sel} hit={hitCircle([1.35 + BAND.line60 + 0.5, 2.6], 12)}>
          <text x={sx(2.18)} y={sy(2.62)} fontSize={7} fill="var(--c-contour)">60</text>
          <text x={sx(1.92)} y={sy(2.85)} fontSize={7} fill="var(--c-contour)">30</text>
        </Feat>
        <Feat id="drying" label="Drying area with drying height" {...sel} hit={hitCircle(DRYING_LABEL.at, 10)}>
          <text x={sx(DRYING_LABEL.at[0])} y={sy(DRYING_LABEL.at[1])} fontSize={8} textAnchor="middle" fill={INK} textDecoration="underline" fontStyle="italic">
            {DRYING_LABEL.height}
          </text>
        </Feat>

        {/* hazards */}
        <Feat id="rock-sunken" label="Submerged rock" {...sel} hit={hitCircle(SUNKEN_ROCK.at)}>
          <DangerCircle at={SUNKEN_ROCK.at} />
          <text x={sx(SUNKEN_ROCK.at[0])} y={sy(SUNKEN_ROCK.at[1]) + 4} fontSize={12} textAnchor="middle" fill={INK}>+</text>
        </Feat>
        <Feat id="rock-drying" label="Rock that covers and uncovers" {...sel} hit={hitCircle(DRYING_ROCK.at)}>
          <text x={sx(DRYING_ROCK.at[0])} y={sy(DRYING_ROCK.at[1]) + 4} fontSize={13} textAnchor="middle" fill={INK}>✱</text>
          <text x={sx(DRYING_ROCK.at[0]) - 9} y={sy(DRYING_ROCK.at[1]) + 4} fontSize={7} textAnchor="end" fill={INK} textDecoration="underline">({DRYING_ROCK.height})</text>
        </Feat>
        <Feat id="wreck" label="Wreck" {...sel} hit={hitCircle(WRECK.at)}>
          <DangerCircle at={WRECK.at} r={12} />
          <text x={sx(WRECK.at[0])} y={sy(WRECK.at[1]) + 3} fontSize={8} textAnchor="middle" fill={INK}>Wk</text>
        </Feat>
        <Feat id="wreck" label="Obstruction" {...sel} hit={hitCircle(OBSTRUCTION.at)}>
          <DangerCircle at={OBSTRUCTION.at} r={13} />
          <text x={sx(OBSTRUCTION.at[0])} y={sy(OBSTRUCTION.at[1]) + 3} fontSize={6.5} textAnchor="middle" fill={INK}>Obstn</text>
        </Feat>
        <Feat id="kelp" label="Kelp" {...sel} hit={hitCircle(KELP.at, 16)}>
          <path d={`M${sx(KELP.at[0]) - 14},${sy(KELP.at[1])} q3.5,-5 7,0 t7,0 t7,0 t7,0`} fill="none" stroke={INK} strokeWidth={0.9} />
          <text x={sx(KELP.at[0])} y={sy(KELP.at[1]) + 11} fontSize={7.5} fontStyle="italic" textAnchor="middle" fill={INK}>Kelp</text>
        </Feat>

        {/* aids */}
        <Feat id="buoy" label={`Green buoy ${BUOY.label} ${BUOY.light}`} {...sel} hit={hitCircle(BUOY.at)}>
          <Flare at={BUOY.at} />
          <path d={`M${sx(BUOY.at[0])},${sy(BUOY.at[1])} l-3,-9 l5,-4 l3,9z`} fill="var(--c-green)" stroke={INK} strokeWidth={0.6} />
          <circle cx={sx(BUOY.at[0])} cy={sy(BUOY.at[1])} r={2} fill="none" stroke={INK} strokeWidth={0.8} />
          <text x={sx(BUOY.at[0]) + 8} y={sy(BUOY.at[1]) + 10} fontSize={7.5} fill={INK}>{BUOY.label}</text>
          <text x={sx(BUOY.at[0]) + 8} y={sy(BUOY.at[1]) + 19} fontSize={7.5} fill={MAG}>{BUOY.light}</text>
        </Feat>
        <Feat id="daybeacon" label="Green daybeacon SG 1" {...sel} hit={hitCircle(DAYBEACON.at)}>
          <rect x={sx(DAYBEACON.at[0]) - 3.5} y={sy(DAYBEACON.at[1]) - 3.5} width={7} height={7} fill="var(--c-green)" stroke={INK} strokeWidth={0.6} />
          <text x={sx(DAYBEACON.at[0]) - 6} y={sy(DAYBEACON.at[1]) + 12} fontSize={7} textAnchor="middle" fill={INK}>{DAYBEACON.label}</text>
        </Feat>
        <Feat id="lighthouse" label={`Lighthouse ${LIGHTHOUSE.light}`} {...sel} hit={hitCircle(LIGHTHOUSE.at, 16)}>
          <Flare at={LIGHTHOUSE.at} dx={1} dy={-0.4} />
          <circle cx={sx(LIGHTHOUSE.at[0])} cy={sy(LIGHTHOUSE.at[1])} r={3} fill={INK} />
          <text x={sx(LIGHTHOUSE.at[0]) + 4} y={sy(LIGHTHOUSE.at[1]) - 18} fontSize={7.5} fill={INK}>{LIGHTHOUSE.label}</text>
          <text x={sx(LIGHTHOUSE.at[0]) + 4} y={sy(LIGHTHOUSE.at[1]) - 9} fontSize={7.5} fill={MAG}>{LIGHTHOUSE.light}</text>
        </Feat>
        <Feat id="light" label="Light characteristic on the buoy" {...sel} hit={hitRect(sx(BUOY.at[0]) + 6, sy(BUOY.at[1]) + 12, 44, 10)}>
          <g />
        </Feat>
        <Feat id="landmark" label="Landmark: tank" {...sel} hit={hitCircle(LANDMARK.at)}>
          <circle cx={sx(LANDMARK.at[0])} cy={sy(LANDMARK.at[1])} r={3.5} fill="none" stroke={INK} strokeWidth={0.9} />
          <circle cx={sx(LANDMARK.at[0])} cy={sy(LANDMARK.at[1])} r={0.9} fill={INK} />
          <text x={sx(LANDMARK.at[0])} y={sy(LANDMARK.at[1]) - 7} fontSize={7.5} textAnchor="middle" fill={INK}>{LANDMARK.label}</text>
        </Feat>

        {/* rose */}
        <Feat id="rose" label="Compass rose" {...sel} hit={hitCircle(ROSE.c, ROSE.r * PX + 6)}>
          <CompassRose cx={sx(ROSE.c[0])} cy={sy(ROSE.c[1])} r={ROSE.r * PX} />
        </Feat>

        {/* bar scale on the west mainland */}
        <Feat id="scale" label="Bar scale" {...sel} hit={hitRect(sx(0.12) - 4, sy(0.55) - 6, 1.05 * PX, 26)}>
          <rect x={sx(0.15)} y={sy(0.42)} width={0.5 * PX} height={4} fill={INK} />
          <rect x={sx(0.65)} y={sy(0.42)} width={0.5 * PX} height={4} fill="#fff" stroke={INK} strokeWidth={0.6} />
          <text x={sx(0.15)} y={sy(0.42) + 13} fontSize={7} fill={INK}>0</text>
          <text x={sx(1.15)} y={sy(0.42) + 13} fontSize={7} fill={INK} textAnchor="end">1 NM</text>
        </Feat>

        <Feat id="notes" label="Chart note A" {...sel} hit={hitRect(sx(0.08), sy(2.0), 1.15 * PX, 0.75 * PX)}>
          <text x={sx(0.12)} y={sy(1.85)} fontSize={7} fill={MAG} fontWeight={600}>NOTE A</text>
          <text x={sx(0.12)} y={sy(1.68)} fontSize={6} fill={INK}>Restricted area —</text>
          <text x={sx(0.12)} y={sy(1.53)} fontSize={6} fill={INK}>see Coast Pilot.</text>
          <text x={sx(0.12)} y={sy(1.38)} fontSize={6} fill={INK}>(fictional)</text>
        </Feat>
        <Feat id="datum" label="Datum and units note" {...sel} hit={hitRect(sx(0.08), sy(8.85), 1.2 * PX, 0.9 * PX)}>
          <text x={sx(0.12)} y={sy(8.65)} fontSize={7.2} fontWeight={700} fill={INK}>FICTIONAL SOUND</text>
          <text x={sx(0.12)} y={sy(8.47)} fontSize={5.6} fill={INK}>SOUNDINGS IN FEET</text>
          <text x={sx(0.12)} y={sy(8.34)} fontSize={5.6} fill={INK}>AT MLLW</text>
          <text x={sx(0.12)} y={sy(8.15)} fontSize={5.6} fill={MAG}>NOT FOR NAVIGATION</text>
        </Feat>
      </g>

      <Feat id="grid" label="Latitude and longitude borders" {...sel} hit={hitRect(MARGIN - 30, MARGIN, 30, HEIGHT_NM * PX)}>
        <BorderScales />
      </Feat>
      <rect x={chartRect.x} y={chartRect.y} width={chartRect.w} height={chartRect.h} fill="none" stroke={INK} strokeWidth={1} />

      {showPoints && (
        <g>
          {(['A', 'B'] as const).map((k) => (
            <g key={k}>
              <circle cx={sx(POINTS[k][0])} cy={sy(POINTS[k][1])} r={5} fill="var(--c-red)" stroke="#fff" strokeWidth={1.5} />
              <text x={sx(POINTS[k][0]) + (k === 'A' ? -9 : 9)} y={sy(POINTS[k][1]) + (k === 'A' ? -12 : -7)} fontSize={12} fontWeight={700} textAnchor={k === 'A' ? 'end' : 'start'} fill="var(--c-red)" stroke="#fff" strokeWidth={3} paintOrder="stroke">
                {k}
              </text>
            </g>
          ))}
        </g>
      )}
      {overlay}
      <text x={SVG_W - MARGIN} y={SVG_H - 8} fontSize={8} textAnchor="end" fill={MAG} fontFamily="var(--font-data)">
        FICTIONAL — NOT FOR NAVIGATION · simplified symbols
      </text>
      <text x={MARGIN} y={SVG_H - 8} fontSize={8} fill={INK} fontFamily="var(--font-data)" opacity={0.7}>
        Latitude scale: left &amp; right borders
      </text>
    </svg>
  );
}
