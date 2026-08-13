import { getLucideIcon } from '@/lib/icons';
import {
  BrandAccent,
  accentBgClass,
  accentTextClass,
  isBrandAccent,
} from '@/lib/brand-accent';
import { cn } from '@/lib/utils';

export type ApproachItemData = {
  id: string;
  title: string;
  desc: string;
  icon?: string;
};

type ApproachItemRowProps = {
  item: ApproachItemData;
  accent: BrandAccent;
};

export function ApproachItemRow({ item, accent }: ApproachItemRowProps) {
  const Icon = getLucideIcon(item.icon);

  return (
    <li className="flex gap-3">
      <span
        className={cn(
          'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white',
          accentBgClass(accent),
          accent === 'yellow' && 'text-ink-primary',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <h4 className="font-serif text-sm font-bold text-ink-primary">{item.title}</h4>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-muted sm:text-[13px]">{item.desc}</p>
      </div>
    </li>
  );
}

type ApproachColumnProps = {
  title: string;
  accent?: string;
  items: ApproachItemData[];
};

export function ApproachColumn({ title, accent, items }: ApproachColumnProps) {
  const tone: BrandAccent = isBrandAccent(accent) ? accent : 'blue';

  return (
    <div>
      <h3 className={cn('font-serif text-lg font-bold sm:text-xl', accentTextClass(tone))}>
        {title}
      </h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <ApproachItemRow key={item.id} item={item} accent={tone} />
        ))}
      </ul>
    </div>
  );
}
