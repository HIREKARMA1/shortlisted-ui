type ResultFlowDiagramProps = {
  label: string;
  steps: string[];
};

export function ResultFlowDiagram({ label, steps }: ResultFlowDiagramProps) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[250px] lg:max-w-[270px]">
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <marker id="ft-a-blue" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#1b52a4" />
          </marker>
          <marker id="ft-a-yellow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#fec40d" />
          </marker>
          <marker id="ft-a-red" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#d64246" />
          </marker>
          <marker id="ft-a-green" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#098855" />
          </marker>
        </defs>

        <path
          d="M 55 55 A 72 72 0 0 1 165 55"
          fill="none"
          stroke="#1b52a4"
          strokeWidth="8"
          strokeLinecap="round"
          markerEnd="url(#ft-a-blue)"
        />
        <path
          d="M 165 55 A 72 72 0 0 1 165 165"
          fill="none"
          stroke="#fec40d"
          strokeWidth="8"
          strokeLinecap="round"
          markerEnd="url(#ft-a-yellow)"
        />
        <path
          d="M 165 165 A 72 72 0 0 1 55 165"
          fill="none"
          stroke="#d64246"
          strokeWidth="8"
          strokeLinecap="round"
          markerEnd="url(#ft-a-red)"
        />
        <path
          d="M 55 165 A 72 72 0 0 1 55 55"
          fill="none"
          stroke="#098855"
          strokeWidth="8"
          strokeLinecap="round"
          markerEnd="url(#ft-a-green)"
        />
      </svg>

      <div className="absolute inset-[18%] flex flex-col items-center justify-center text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-blue">{label}</p>
        <ul className="mt-2 space-y-0.5">
          {steps.map((step) => (
            <li key={step} className="text-[11px] font-semibold leading-snug text-ink-primary">
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
