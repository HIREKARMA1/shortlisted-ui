type ResultFlowDiagramProps = {
  label: string;
  steps: string[];
};

const CENTER = 110;
const RADIUS = 88;
const STROKE = 11;

/** SVG angles: 0 = right, 90 = bottom, 180 = left, 270 = top. Increasing = clockwise. */
function point(angle: number): [number, number] {
  const rad = (angle * Math.PI) / 180;
  return [CENTER + RADIUS * Math.cos(rad), CENTER + RADIUS * Math.sin(rad)];
}

function arcPath(from: number, to: number): string {
  const [x1, y1] = point(from);
  const [x2, y2] = point(to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const ARROW_HEAD = 'M 0 0 L 2.6 1.3 L 0 2.6 Z';

/** Sequence mirrors the design: blue up the left into the top, yellow fading to orange down
 *  the right, red across the bottom, green back up the left. */
const SEGMENTS = [
  { id: 'blue', from: 182, to: 267, stroke: '#1b52a4', marker: 'ft-arrow-blue' },
  { id: 'amber', from: 277, to: 357, stroke: 'url(#ft-arc-amber)', marker: 'ft-arrow-orange' },
  { id: 'red', from: 7, to: 87, stroke: '#d64246', marker: 'ft-arrow-red' },
  { id: 'green', from: 97, to: 172, stroke: '#098855', marker: 'ft-arrow-green' },
];

function normalizeStep(step: string): string {
  return step.replace(/[\u2192>\s]+$/, '').trim();
}

export function ResultFlowDiagram({ label, steps }: ResultFlowDiagramProps) {
  const items = steps.map(normalizeStep).filter(Boolean);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[290px] lg:max-w-[344px] lg:self-center">
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="ft-arc-amber" x1="110" y1="22" x2="198" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fec40d" />
            <stop offset="55%" stopColor="#fbaa11" />
            <stop offset="100%" stopColor="#f58020" />
          </linearGradient>
          {[
            ['ft-arrow-blue', '#1b52a4'],
            ['ft-arrow-orange', '#f58020'],
            ['ft-arrow-red', '#d64246'],
            ['ft-arrow-green', '#098855'],
          ].map(([id, fill]) => (
            <marker
              key={id}
              id={id}
              markerWidth="2.6"
              markerHeight="2.6"
              refX="1.3"
              refY="1.3"
              orient="auto"
            >
              <path d={ARROW_HEAD} fill={fill} />
            </marker>
          ))}
        </defs>

        {SEGMENTS.map((segment) => (
          <path
            key={segment.id}
            d={arcPath(segment.from, segment.to)}
            fill="none"
            stroke={segment.stroke}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            markerEnd={`url(#${segment.marker})`}
          />
        ))}
      </svg>

      <div className="absolute inset-[17%] flex flex-col items-center justify-center text-center">
        <p className="text-[16px] font-bold leading-tight text-[#172033] sm:text-[19px]">{label}</p>
        <ul className="mx-auto mt-1.5 max-w-[150px] space-y-[3px] sm:mt-2.5 sm:max-w-[168px] sm:space-y-1">
          {items.map((step, index) => (
            <li
              key={step}
              className="text-[11.5px] font-semibold leading-[1.35] text-[#172033] sm:text-[13.5px]"
            >
              {step}
              {index < items.length - 1 && <span className="ml-1 text-[#4b5563]">&rarr;</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
