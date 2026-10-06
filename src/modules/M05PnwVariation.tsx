import { Quiz } from '../components/Quiz';
import { Callout, Section } from '../components/ui';
import { formatVariation, toSignedMinutes, updateVariation } from '../lib/nav/variation';
import { UpdateRoseCalc } from './M04TrueMagnetic';
import { THIS_YEAR, type ModuleProps } from './types';

const OLD = { deg: 19, min: 30, year: 2005, ann: 8 };

export default function M05PnwVariation({ onScore }: ModuleProps) {
  const oldBase = toSignedMinutes(OLD.deg, OLD.min, 'E');
  const updated = updateVariation(oldBase, -OLD.ann, OLD.year, THIS_YEAR);
  const years = THIS_YEAR - OLD.year;
  return (
    <>
      <Callout kind="safety" title="Do not assume a remembered Seattle magnetic variation is permanently correct.">
        Puget Sound and the Salish Sea currently have substantial <strong>easterly</strong> variation. The exact number depends on where you
        are and on the date, and it keeps changing. A number someone quoted you, or one printed on an old chart, can be off by a degree or
        more.
      </Callout>

      <Section title="Where to get the right number">
        <ol className="steps">
          <li>
            <div>
              <strong>The compass rose on your chart</strong>, the one nearest your route. Large charts can carry several roses, and they can
              differ.
            </div>
          </li>
          <li>
            <div>
              <strong>The year printed on that rose</strong>. The variation is exact only for that year.
            </div>
          </li>
          <li>
            <div>
              <strong>The stated annual change</strong>. Multiply it by the years since the rose year and apply it with signs (E +, W −).
            </div>
          </li>
          <li>
            <div>
              <strong>A current authoritative calculator</strong> for a cross-check, especially if the rose is old: NOAA NCEI&apos;s magnetic
              field calculators at{' '}
              <a href="https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml" target="_blank" rel="noreferrer">
                ngdc.noaa.gov/geomag
              </a>
              . Enter your launch&apos;s latitude, longitude and date.
            </div>
          </li>
        </ol>
      </Section>

      <Section title="Example: updating an old rose">
        <div className="prose">
          <p>
            A (fictional) older chart reads <span className="data">VAR 19°30′E (2005) ANNUAL CHANGE 8′W</span>. You are paddling in{' '}
            {THIS_YEAR}.
          </p>
          <p className="work">
            {years} years × 8′W = {years * 8}′ less easterly. 19°30′E = {oldBase}′. {oldBase} − {years * 8} = {updated}′ ={' '}
            {formatVariation(updated)}.
          </p>
          <p>
            Two lessons. First, ignoring the update would put your bearings off by about {((years * 8) / 60).toFixed(1)}°. Over a 3 NM
            crossing, every degree of error moves you about 0.05 NM (300 ft) sideways. Second, the annual change is itself only an estimate.
            Over two decades it can drift, so for an old chart, trust a current calculator over the extrapolation.
          </p>
        </div>
        <UpdateRoseCalc idPrefix="u5" initial={{ deg: '19', min: '30', dir: 'E', year: '2005', ann: '8', annDir: 'W' }} />
      </Section>

      <Section title="Printed charts go out of date too">
        <ul>
          <li>Check the edition date on the chart and whether it has been corrected through recent Local Notices to Mariners.</li>
          <li>
            NOAA has been moving from traditional paper and raster charts to electronic (ENC-based) charts, and paper copies today are
            usually printed on demand. Whatever you buy, check its edition and correction date. An old paper chart in a drawer may have
            outdated aids, depths and variation.
          </li>
          <li>Buoys get moved, renumbered or discontinued. Ferry routes and restricted areas change.</li>
        </ul>
      </Section>

      <Quiz
        onScore={onScore}
        questions={[
          {
            q: 'A friend says "Seattle variation is 16° E, just use that." Best response?',
            options: [
              'Use it, since variation is constant',
              'Check the rose on the chart you are using, update it for the year, and cross-check a current calculator',
              'Use 0°, since the difference is small',
              'Use whatever the GPS says',
            ],
            answer: 1,
            why: 'Variation depends on place and date. Get it from an authoritative, current source.',
          },
          {
            q: 'Your chart has two compass roses showing different variations. Which do you use?',
            options: ['The average', 'The one nearest your route', 'The larger one', 'The one at the top'],
            answer: 1,
            why: 'Variation changes across a chart. Use the rose nearest where you are navigating.',
          },
          {
            q: 'Why cross-check an old rose with a current calculator?',
            options: [
              'The annual change itself drifts, so long extrapolations get unreliable',
              'Old roses use different units',
              'True north has moved',
              'It is a legal requirement',
            ],
            answer: 0,
            why: 'The printed annual change is a snapshot estimate. Over many years it becomes less reliable.',
          },
        ]}
      />
    </>
  );
}
