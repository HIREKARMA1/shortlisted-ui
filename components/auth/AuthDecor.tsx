export function AuthDecor() {
  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full text-brand-blue"
        viewBox="0 0 800 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.2" strokeDasharray="2 7" strokeLinecap="round">
          <path d="M-40 140 C 180 80, 420 200, 680 120 S 860 180, 860 180" />
          <path d="M-40 420 C 160 360, 480 500, 720 400 S 860 460, 860 460" />
          <path d="M-40 720 C 200 660, 440 800, 700 700 S 860 740, 860 740" />
        </g>
      </svg>
      <div className="pointer-events-none absolute -right-20 top-24 h-56 w-56 rounded-full bg-brand-sky/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-16 bottom-32 h-48 w-48 rounded-full bg-brand-orange/8 blur-3xl" aria-hidden />
    </>
  );
}
