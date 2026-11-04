import { getLucideIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

type FeatureFloatCardProps = {
  label: string;
  /** Brand key (`blue`) or hex (`#1b52a4`) */
  accent?: string;
  icon?: string;
  className?: string;
};

const NAMED_ACCENTS: Record<string, string> = {
  blue: '#1b52a4',
  sky: '#00a2e5',
  yellow: '#fec40d',
  orange: '#f58020',
  red: '#d64246',
  green: '#098855',
};

function resolveAccent(accent?: string): string {
  if (!accent) return NAMED_ACCENTS.blue;
  if (accent.startsWith('#')) return accent;
  return NAMED_ACCENTS[accent] ?? NAMED_ACCENTS.blue;
}

function needsDarkIcon(hex: string): boolean {
  return hex.toLowerCase() === '#fec40d' || hex.toLowerCase() === '#f58020';
}

export function FeatureFloatCard({ label, accent, icon, className }: FeatureFloatCardProps) {
  const tone = resolveAccent(accent);
  const Icon = getLucideIcon(icon);
  const darkIcon = needsDarkIcon(tone);

  return (
    <div
      className={cn(
        'flex min-h-[58px] min-w-0 items-center gap-2.5 rounded-[10px] border border-[#dbe4ef] bg-white/95 px-3 py-2.5 shadow-[0_8px_25px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:gap-3 sm:px-3.5 sm:py-3',
        className,
      )}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] sm:h-9 sm:w-9"
        style={{ backgroundColor: tone, color: darkIcon ? '#111827' : '#ffffff' }}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.35} />
      </span>
      <span className="min-w-0 text-[11px] font-semibold leading-[1.3] text-[#172033] sm:text-[12px] sm:leading-[1.25]">
        {label}
      </span>
    </div>
  );
}
