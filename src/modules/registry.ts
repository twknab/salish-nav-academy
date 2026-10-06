import type { ComponentType } from 'react';
import CheatSheet from './CheatSheet';
import M01Orientation from './M01Orientation';
import M02Hazards from './M02Hazards';
import M03Distance from './M03Distance';
import M04TrueMagnetic from './M04TrueMagnetic';
import M05PnwVariation from './M05PnwVariation';
import M06Deviation from './M06Deviation';
import M07Course from './M07Course';
import M08Position from './M08Position';
import M09Depth from './M09Depth';
import M10Lights from './M10Lights';
import M11Tss from './M11Tss';
import M12Checklist from './M12Checklist';
import M13Final from './M13Final';
import type { ModuleProps } from './types';

export interface ModuleDef {
  id: string; // also the URL hash
  num: string;
  title: string;
  lede: string;
  group: 'Read the chart' | 'Direction & distance' | 'On the water' | 'Put it together';
  Component: ComponentType<ModuleProps>;
  hasQuiz: boolean;
}

export const MODULES: ModuleDef[] = [
  { id: 'orientation', num: '01', title: 'What am I looking at?', lede: 'Click your way around a chart: every feature, what it looks like, and why it matters from a kayak.', group: 'Read the chart', Component: M01Orientation, hasQuiz: true },
  { id: 'hazards', num: '02', title: 'Sea-kayaking hazards', lede: 'The hazards that matter most to a small, slow, low boat, and which ones the chart cannot show you.', group: 'Read the chart', Component: M02Hazards, hasQuiz: true },
  { id: 'distance', num: '03', title: 'Measuring in nautical miles', lede: 'One minute of latitude is one nautical mile. Measure on the side border, never the top.', group: 'Direction & distance', Component: M03Distance, hasQuiz: true },
  { id: 'true-magnetic', num: '04', title: 'True, magnetic and variation', lede: 'Why there are two norths, how to read both rings of the rose, and a sign convention that always works.', group: 'Direction & distance', Component: M04TrueMagnetic, hasQuiz: true },
  { id: 'pnw-variation', num: '05', title: 'Pacific Northwest variation', lede: 'Substantial and easterly, and still changing. Where to get the right number for your trip.', group: 'Direction & distance', Component: M05PnwVariation, hasQuiz: true },
  { id: 'deviation', num: '06', title: 'Deviation vs. variation', lede: 'The error your own boat and gear add to the compass, and when a kayaker needs to care.', group: 'Direction & distance', Component: M06Deviation, hasQuiz: true },
  { id: 'course', num: '07', title: 'Plotting a course', lede: 'Chart to compass and back: lay off a course, steer it, and turn bearings into a position.', group: 'Direction & distance', Component: M07Course, hasQuiz: true },
  { id: 'position', num: '08', title: 'Latitude and longitude', lede: 'Read a coordinate, convert between formats, and plot a GPS position on the chart.', group: 'On the water', Component: M08Position, hasQuiz: true },
  { id: 'depth', num: '09', title: 'Depth and tides', lede: 'A sounding is the depth at chart datum, not today\'s depth. Add the tide, and check the units.', group: 'On the water', Component: M09Depth, hasQuiz: true },
  { id: 'lights', num: '10', title: 'Lights and aids', lede: 'Decode light labels like Fl R 4s, and understand the lateral system rather than a rhyme.', group: 'On the water', Component: M10Lights, hasQuiz: true },
  { id: 'tss', num: '11', title: 'Traffic Separation Schemes', lede: 'How the shipping lanes work, and how a kayak crosses them without impeding anyone.', group: 'On the water', Component: M11Tss, hasQuiz: true },
  { id: 'checklist', num: '12', title: 'Pre-departure chart check', lede: 'A compact checklist for the night before or the beach. Ticks are saved on this device.', group: 'Put it together', Component: M12Checklist, hasQuiz: false },
  { id: 'final', num: '13', title: 'Final exercise: A to B', lede: 'Measure, convert, spot the hazards and decide. Answer first, then reveal.', group: 'Put it together', Component: M13Final, hasQuiz: true },
  { id: 'cheatsheet', num: '✦', title: 'Cheat sheet', lede: 'Everything that matters, on one page.', group: 'Put it together', Component: CheatSheet, hasQuiz: false },
];
