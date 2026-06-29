'use client';

import { Plus, User, UserCheck } from 'lucide-react';
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
  manifestLabel,
  statusLabel,
  statusOpenLabel,
  statusFullLabel,
  loadingLabel,
}: BatchCohortVisualProps) {
  const filled = Math.max(0, maxSeats - seatsRemaining);
  const enrollmentOpen = seatsRemaining > 0;

  return (
    <div className="relative mx-auto w-full max-w-md pl-1 sm:pl-2">
      <div className="relative rounded-2xl border border-brand-blue/15 bg-white/90 p-4 pb-8 shadow-lg shadow-brand-blue/10 backdrop-blur-sm sm:p-5 sm:pb-9">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-sky">{eyebrowLabel}</p>
            <p className="mt-1 truncate font-display text-base font-bold text-brand-blue sm:text-lg">
              <span className="border-b-2 border-brand-orange/80 pb-0.5">{batchName ?? '-'}</span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            {loading ? (
              <span className="text-xs text-ink-muted">{loadingLabel}</span>
            ) : (
              <>
                <p className="font-display text-xl font-extrabold leading-none text-brand-blue sm:text-2xl">
                  {seatsRemaining}
                  <span className="text-base text-brand-sky/60 sm:text-lg">/{maxSeats}</span>
                </p>
                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-[9px]">
                  {seatsLabel}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-brand-blue/10 bg-brand-blue/[0.04] px-2.5 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue shadow-sm">
            <UserCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-sky">{primaryLeadLabel}</p>
            <p className="text-xs font-semibold text-ink-primary sm:text-sm">{coordinatorRoleLabel}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
          {Array.from({ length: maxSeats }, (_, i) => {
            const isFilled = i < filled;
            const isOpen = !isFilled && enrollmentOpen;

            return (
              <div
                key={i}
                className={cn(
                  'flex h-8 items-center justify-center rounded-md sm:h-9',
                  isFilled && 'bg-brand-blue/10',
                  isOpen && 'border-2 border-dashed border-brand-sky/50 bg-brand-sky/[0.06]',
                  !isFilled && !isOpen && 'border border-line-default bg-soft'
                )}
              >
                {isFilled && <User className="h-4 w-4 text-brand-blue/60" aria-hidden />}
                {isOpen && <Plus className="h-3.5 w-3.5 text-brand-sky" strokeWidth={2.5} aria-hidden />}
              </div>
            );
          })}
        </div>

        <div className="mt-3 rounded-lg border-2 border-brand-blue/30 bg-brand-blue/[0.03] py-2 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-brand-blue sm:text-[10px]">
            {manifestLabel}
          </span>
        </div>
        <div
          className={cn(
            'absolute left-4 bottom-[-1.25rem] rounded-lg px-3 py-2 shadow-md sm:left-6 sm:bottom-[-1.5rem] sm:px-4',
            enrollmentOpen ? 'bg-brand-orange' : 'bg-brand-blue'
          )}
        >
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/80">{statusLabel}</p>
          <p className="font-display text-xs font-bold text-white sm:text-sm">
            {loading ? '…' : enrollmentOpen ? statusOpenLabel : statusFullLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
