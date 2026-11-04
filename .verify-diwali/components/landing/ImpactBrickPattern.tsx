/** Brick overlay - matches 100xdevs impact card texture */
export function ImpactBrickPattern({ id = 'sl-impact-brick' }: { id?: string }) {
  return (
    <svg
      className="absolute inset-0 z-0 h-full w-full text-white/30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern id={id} x="0" y="0" width="56" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M0 0h24v14H0V0zm28 0h28v14H28V0zM14 18h28v14H14V18z"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
