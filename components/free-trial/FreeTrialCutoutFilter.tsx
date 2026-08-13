/** Hidden SVG filter used by `.ft-cutout` to remove solid black photo backgrounds. */
export function FreeTrialCutoutFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden" focusable="false">
      <defs>
        <filter id="ft-remove-black" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              18 18 18 0 -0.15
            "
          />
        </filter>
      </defs>
    </svg>
  );
}
