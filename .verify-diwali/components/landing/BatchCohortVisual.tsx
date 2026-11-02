'use client';

import { Plus, ShieldCheck, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const BATCH_SIZE = 12;

type BatchCohortVisualProps = {
  seatsRemaining: number;
  maxSeats?: number;
  batchName?: string;
  loading?: boolean;
  eyebrowLabel: string;
  primaryLeadLabel: string;
  coordinatorRoleLabel: string;
  seatsLabel: string;
  supportBadgeLabel: string;
  manifestLabel: string;
  statusLabel: string;
  statusOpenLabel: string;
  statusFullLabel: string;
  loadingLabel: string;
};

export function BatchCohortVisual({
  seatsRemaining,
  maxSeats = BATCH_SIZE,
  batchName,
  loading,
  eyebrowLabel,
  primaryLeadLabel,
  coordinatorRoleLabel,
  seatsLabel,
  supportBadgeLabel,
  manifestLabel,
  statusLabel,
  statusOpenLabel,
  statusFullLabel,
  loadingLabel,
}: BatchCohortVisualProps) {
  const filled = Math.max(0, maxSeats - seatsRemaining);
  const enrollmentOpen = seatsRemaining > 0;

  return (
    <div className="relative mx-auto w-full max-w-[400px] min-w-0 lg:ml-auto lg:mr-0">
      <div className="relative rounded-[22px] bg-white p-4 pb-8 shadow-[0_18px_44px_rgba(4,20,46,0.32)] sm:p-5 sm:pb-9">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1b52a4]">
              {eyebrowLabel}
            </p>
            <p className="mt-0.5 truncate font-display text-[1.15rem] font-extrabold leading-tight text-[#111827] sm:text-[1.3rem]">
              {batchName ?? '-'}
            </p>
          </div>
          <div className="shrink-0 text-right">
            {loading ? (
              <span className="text-xs text-ink-muted">{loadingLabel}</span>
            ) : (
              <>
                <p className="font-display text-lg font-extrabold leading-none text-[#1b52a4] sm:text-xl">
                  {seatsRemaining}
                  <span className="text-sm text-[#1b52a4]/50 sm:text-base">/{maxSeats}</span>
                </p>
                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#f15a2b]">
                  {seatsLabel}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#e8eef7] bg-[#f7f9fc] px-2.5 py-2 sm:px-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1b52a4] shadow-sm">
            <User className="h-4 w-4 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#00a2e5]">
              {primaryLeadLabel}
            </p>
            <p className="truncate text-xs font-semibold text-[#111827] sm:text-sm">{coordinatorRoleLabel}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#cfeedd] bg-white px-2 py-0.5 text-[9px] font-semibold text-[#16a34a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            {supportBadgeLabel}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
          {Array.from({ length: maxSeats }, (_, i) => {
            const isFilled = i < filled;
            const isOpen = !isFilled && enrollmentOpen;

            return (
              <div
                key={i}
                className={cn(
                  'flex h-8 items-center justify-center rounded-lg sm:h-9',
                  isFilled && 'bg-[#eef3fb]',
                  isOpen && 'border border-[#c5d8f5] bg-white',
                  !isFilled && !isOpen && 'border border-[#e5e7eb] bg-[#f8fafc]'
                )}
              >
                {isFilled && <User className="h-4 w-4 text-[#1b52a4]/55" aria-hidden />}
                {isOpen && <Plus className="h-4 w-4 text-[#1b52a4]/70" strokeWidth={2.2} aria-hidden />}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-[#d5e4f8] bg-white py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1b52a4]" aria-hidden />
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1b52a4] sm:text-[10px]">
            {manifestLabel}
          </span>
        </div>

        <div
          className={cn(
            'absolute bottom-[-0.95rem] left-4 flex items-center gap-2 rounded-lg px-2.5 py-1.5 shadow-lg sm:left-5 sm:px-3',
            enrollmentOpen ? 'bg-[#f15a2b]' : 'bg-[#1b52a4]'
          )}
        >
          <Users className="h-4 w-4 text-white" aria-hidden />
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/80">{statusLabel}</p>
            <p className="font-display text-xs font-bold leading-tight text-white sm:text-sm">
              {loading ? '…' : enrollmentOpen ? statusOpenLabel : statusFullLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
