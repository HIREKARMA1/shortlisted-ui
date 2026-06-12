'use client';

import { User, UserCheck } from 'lucide-react';

const BATCH_SIZE = 12;

/** Seat positions on a ring — unique to Shortlisted's 12-student cohort model */
const SEAT_ANGLES = Array.from({ length: BATCH_SIZE }, (_, i) => (i * 360) / BATCH_SIZE - 90);

type BatchCohortVisualProps = {
  seatsRemaining: number;
  loading?: boolean;
  coordinatorLabel: string;
  seatsLabel: string;
  loadingLabel: string;
  fullLabel?: string;
};

export function BatchCohortVisual({
  seatsRemaining,
  loading,
  coordinatorLabel,
  seatsLabel,
  loadingLabel,
  fullLabel,
}: BatchCohortVisualProps) {
  const filled = Math.max(0, BATCH_SIZE - seatsRemaining);

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-brand-blue/10 bg-gradient-to-br from-brand-blue/[0.04] via-white to-brand-orange/[0.06]">
      <div className="relative aspect-square p-6 sm:p-8">
        {/* Coordinator hub */}
        <div className="absolute left-1/2 top-[46%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue shadow-lg shadow-brand-blue/25 ring-4 ring-white">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <span className="mt-2 max-w-[88px] text-center text-[10px] font-bold uppercase tracking-wider text-brand-blue">
            {coordinatorLabel}
          </span>
        </div>

        {/* Student seats on ring — slightly tighter radius, shifted up */}
        {SEAT_ANGLES.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const radius = 38;
          const x = 50 + radius * Math.cos(rad);
          const y = 46 + radius * Math.sin(rad);
          const isFilled = i < filled;
          const isOpen = !isFilled && seatsRemaining > 0;

          return (
            <div
              key={i}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 ${
                  isFilled
                    ? 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue'
                    : isOpen
                      ? 'border-brand-green bg-brand-green/15 text-brand-green sl-seat-pulse'
                      : 'border-line-default bg-soft text-ink-muted'
                }`}
                title={isFilled ? undefined : isOpen ? seatsLabel : fullLabel}
              >
                <User className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Seat count — footer strip, never overlaps the ring */}
      <div className="border-t border-line-default bg-white/80 px-4 py-3 text-center backdrop-blur-sm">
        {loading ? (
          <span className="text-xs text-ink-muted">{loadingLabel}</span>
        ) : (
          <p className="text-xs font-semibold text-ink-primary">
            <span className="font-display text-lg font-extrabold text-brand-orange">{seatsRemaining}</span>
            <span className="text-ink-muted"> / {BATCH_SIZE}</span>
            <span className="ml-1.5 text-ink-muted">{seatsLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
