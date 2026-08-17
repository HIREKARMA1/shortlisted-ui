import { getLucideIcon } from '@/lib/icons';
import { BrandAccent, isBrandAccent } from '@/lib/brand-accent';
import { cn } from '@/lib/utils';

export type ApproachItemData = {
  id: string;
  title: string;
  desc: string;
  icon?: string;
};

type ApproachTone = {
  bar: string;
  tile: string;
  glyph: string;
};

const TONES: Record<BrandAccent, ApproachTone> = {
  blue: { bar: '#1b52a4', tile: '#e8f1ff', glyph: '#1b52a4' },
  sky: { bar: '#00a2e5', tile: '#e5f6ff', glyph: '#0086bf' },
  yellow: { bar: '#fec40d', tile: '#fff6d9', glyph: '#8a6400' },
  orange: { bar: '#f58020', tile: '#fff1e4', glyph: '#c65c07' },
  red: { bar: '#d64246', tile: '#fdeaea', glyph: '#b32a2e' },
  green: { bar: '#098855', tile: '#098855', glyph: '#ffffff' },
};

type ApproachItemRowProps = {
  item: ApproachItemData;
  tone: ApproachTone;
};

function ApproachItemRow({ item, tone }: ApproachItemRowProps) {
  const Icon = getLucideIcon(item.icon);

  return (
    <li className="flex gap-2.5 sm:gap-3">
      <span
        className="mt-[2px] grid h-8 w-8 shrink-0 place-items-center rounded-[8px] sm:h-9 sm:w-9"
        style={{ backgroundColor: tone.tile, color: tone.glyph }}
      >
        <Icon className="h-[15px] w-[15px] sm:h-[17px] sm:w-[17px]" strokeWidth={2} />
      </span>
      <p className="min-w-0 text-[12.5px] leading-[1.65] text-[#5b6675] sm:text-[13px] sm:leading-[1.75]">
        <span className="font-bold text-[#172033]">{item.title}</span>
        <span className="text-[#9aa4b2]"> — </span>
        {item.desc}
      </p>
    </li>
  );
}

type ApproachColumnProps = {
  title: string;
  accent?: string;
  items: ApproachItemData[];
  className?: string;
};

export function ApproachColumn({ title, accent, items, className }: ApproachColumnProps) {
  const tone = TONES[isBrandAccent(accent) ? accent : 'blue'];

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[12px] border border-[#e7ebf1] bg-[#fcfcfd] shadow-[0_1px_3px_rgba(15,23,42,0.05)]',
        className,
      )}
    >
      <div className="px-4 py-2.5 text-center sm:py-3" style={{ backgroundColor: tone.bar }}>
        <h3 className="text-[15px] font-bold leading-snug text-white sm:text-[16px]">{title}</h3>
      </div>
      <ul className="space-y-3 px-3.5 py-4 sm:space-y-4 sm:px-4 sm:py-[18px]">
        {items.map((item) => (
          <ApproachItemRow key={item.id} item={item} tone={tone} />
        ))}
      </ul>
    </div>
  );
}
