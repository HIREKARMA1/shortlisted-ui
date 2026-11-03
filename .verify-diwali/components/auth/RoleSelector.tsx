'use client';

import { cn } from '@/lib/utils';
import { GraduationCap, Shield, Users } from 'lucide-react';
import { UserType } from '@/lib/api';

const ROLE_ICONS: Record<UserType, typeof GraduationCap> = {
  student: GraduationCap,
  admin: Users,
  super_admin: Shield,
};

type RoleSelectorProps = {
  label: string;
  value: UserType;
  onChange: (value: UserType) => void;
  options: { value: UserType; label: string }[];
};

export function RoleSelector({ label, value, onChange, options }: RoleSelectorProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</span>
      <div
        className={cn(
          'grid gap-1 rounded-xl bg-soft p-1 ring-1 ring-line-default/70',
          options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        )}
      >
        {options.map((opt) => {
          const Icon = ROLE_ICONS[opt.value];
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-1.5 py-2 text-center transition-all',
                active
                  ? 'bg-white text-brand-blue shadow-sm ring-1 ring-line-default/80'
                  : 'text-ink-muted hover:text-ink-secondary'
              )}
            >
              <Icon className={cn('h-4 w-4', active && 'text-brand-blue')} />
              <span className="text-[10px] font-semibold leading-tight sm:text-[11px]">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
