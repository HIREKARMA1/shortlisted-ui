'use client';

import { Plus, ShieldCheck, UserRound, Users } from 'lucide-react';

type CohortCardProps = {
  seatsOpen: number | null;
  loading: boolean;
};

export function CohortCard({ seatsOpen, loading }: CohortCardProps) {
  const isAvailable = seatsOpen !== null && !loading;
  const openSeats = isAvailable ? Math.max(0, Math.min(12, Math.trunc(seatsOpen))) : null;
  const filledSeats = openSeats === null ? 0 : 12 - openSeats;

  return (
    <section className="active-cohort-card" aria-label="Active cohort">
      <style jsx>{`
        .active-cohort-card {
          --blue: #1b52a4;
          --blue-dark: #0c2d63;
          --sky: #00a2e5;
          --yellow: #fec40d;
          --orange: #f58020;
          --red: #d64246;
          --green: #098855;
          --navy: #0c2d63;
          --pale-blue: #eef5ff;
          --seat-blue: #e3ecf7;
          position: relative;
          isolation: isolate;
          width: 100%;
          max-width: 400px;
          margin-inline: auto;
          padding: 20px;
          overflow: visible;
          border: 1px solid rgba(255, 255, 255, 0.65);
          border-radius: 24px;
          color: var(--navy);
          background:
            radial-gradient(ellipse at 0% 100%, color-mix(in srgb, var(--yellow) 18%, transparent), transparent 42%),
            linear-gradient(160deg, white 0%, var(--pale-blue) 100%);
          box-shadow:
            0 24px 60px rgba(7, 28, 70, 0.45),
            0 0 0 6px rgba(255, 255, 255, 0.08),
            0 0 0 7px color-mix(in srgb, var(--sky) 35%, transparent),
            -8px 16px 30px color-mix(in srgb, var(--yellow) 18%, transparent);
        }
        .cohort-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .cohort-eyebrow {
          color: var(--sky);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          line-height: 1.3;
          text-transform: uppercase;
        }
        .cohort-name {
          margin-top: 4px;
          color: var(--navy);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .seat-counter { flex: 0 0 auto; min-width: 82px; text-align: right; }
        .seat-count-line { display: flex; align-items: baseline; justify-content: flex-end; gap: 4px; }
        .seat-count {
          color: var(--blue);
          font-size: 30px;
          font-weight: 850;
          letter-spacing: -0.04em;
          line-height: 0.95;
          font-variant-numeric: tabular-nums;
        }
        .seat-total { color: #76a3d8; font-size: 14px; font-weight: 650; }
        .seat-caption {
          margin-top: 5px;
          color: #c2410c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }
        .seat-skeleton {
          display: inline-block;
          width: 32px;
          height: 30px;
          border-radius: 8px;
          background: #e5eaf2;
          animation: cohort-seat-skeleton 1.2s ease-in-out infinite alternate;
        }
        .coordinator-panel {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          padding: 10px;
          border-radius: 12px;
          background: #eef2f9;
        }
        .coordinator-avatar {
          display: grid;
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: var(--blue);
          color: white;
        }
        .coordinator-copy { min-width: 0; flex: 1; }
        .coordinator-eyebrow {
          color: var(--sky);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          line-height: 1.3;
        }
        .coordinator-name { margin-top: 3px; color: var(--navy); font-size: 13px; font-weight: 700; line-height: 1.2; }
        .support-pill {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 5px;
          padding: 6px 8px;
          border: 1px solid rgba(9, 136, 85, 0.25);
          border-radius: 999px;
          background: white;
          color: #08734a;
          font-size: 9px;
          font-weight: 750;
          white-space: nowrap;
        }
        .support-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }
        .seat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 16px; }
        .seat-tile {
          display: grid;
          min-width: 0;
          height: 44px;
          place-items: center;
          border-radius: 11px;
          outline: none;
        }
        .seat-tile.filled { background: var(--seat-blue); color: var(--blue); }
        .seat-tile.open {
          border: 1px solid #9bc7e8;
          background: white;
          color: var(--sky);
        }
        .seat-tile.pending { border: 1px solid #d5e2f1; background: white; }
        .seat-tile:focus-visible { outline: 2px solid var(--sky); outline-offset: 2px; }
        .availability-note { margin-top: 7px; color: #5b6b82; font-size: 10px; text-align: center; }
        .manifest-row {
          display: flex;
          height: 36px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
          border: 1px solid rgba(27, 82, 164, 0.25);
          border-radius: 8px;
          color: var(--navy);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .manifest-row :global(svg) { width: 16px; height: 16px; color: var(--navy); }
        .status-badge {
          position: absolute;
          z-index: 2;
          bottom: -12px;
          left: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          background: #ef5b32;
          color: white;
          box-shadow: 0 8px 20px rgba(194, 65, 35, 0.35);
        }
        .status-icon { width: 16px; height: 16px; flex: 0 0 auto; }
        .status-copy { display: flex; flex-direction: column; gap: 1px; line-height: 1.1; }
        .status-label { font-size: 8px; font-weight: 700; letter-spacing: 0.1em; }
        .status-value { font-size: 11px; font-weight: 800; }
        @keyframes cohort-seat-skeleton { from { opacity: 0.55; } to { opacity: 1; } }
        @media (min-width: 640px) { .active-cohort-card { padding: 24px; } }
        @media (min-width: 900px) {
          .active-cohort-card {
            margin-top: 26px;
            padding-top: 18px;
          }
          .coordinator-panel { margin-top: 10px; }
          .seat-grid { margin-top: 12px; }
          .seat-tile { height: 42px; }
          .manifest-row { margin-top: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .seat-skeleton { animation: none !important; }
        }
      `}</style>

      <header className="cohort-header">
        <div>
          <p className="cohort-eyebrow">ACTIVE COHORT</p>
          <h2 className="cohort-name">Cohort-1</h2>
        </div>
        <div
          className="seat-counter"
          role="group"
          aria-label={openSeats === null ? 'Seat availability unavailable' : `${openSeats} of 12 seats open`}
        >
          <div className="seat-count-line">
            {loading ? (
              <span className="seat-skeleton" aria-hidden="true" />
            ) : (
              <>
                <span className="seat-count">
                  {openSeats ?? '—'}
                </span>
                <span className="seat-total">/12</span>
              </>
            )}
          </div>
          <p className="seat-caption">
            {loading ? 'CHECKING' : openSeats === null ? 'LIMITED' : openSeats === 0 ? 'FULL' : 'SEATS OPEN'}
          </p>
        </div>
      </header>

      <div className="coordinator-panel">
        <span className="coordinator-avatar" aria-hidden="true">
          <UserRound size={20} />
        </span>
        <div className="coordinator-copy">
          <p className="coordinator-eyebrow">PRIMARY LEAD</p>
          <p className="coordinator-name">Placement coordinator</p>
        </div>
        <span className="support-pill">
          <span className="support-dot" aria-hidden="true" />24/7 Support
        </span>
      </div>

      <div className="seat-grid" role="group" aria-label="12 cohort seats">
        {Array.from({ length: 12 }, (_, index) => {
          const filled = openSeats !== null && index < filledSeats;
          const open = openSeats !== null && !filled;
          const label = openSeats === null
            ? `Seat ${index + 1}, availability ${loading ? 'checking' : 'unavailable'}`
            : `Seat ${index + 1}, ${filled ? 'filled' : 'open'}`;
          return (
            <div
              key={index}
              role="img"
              tabIndex={0}
              aria-label={label}
              className={`seat-tile ${filled ? 'filled' : open ? 'open' : 'pending'}`}
            >
              {filled ? <UserRound size={16} aria-hidden="true" /> : open ? <Plus size={16} aria-hidden="true" /> : null}
            </div>
          );
        })}
      </div>

      {openSeats === null && !loading && (
        <p className="availability-note" role="status">Seat availability is temporarily unavailable.</p>
      )}

      <div className="manifest-row">
        <ShieldCheck aria-hidden="true" />
        CERTIFIED RECRUITMENT MANIFEST
      </div>

      <div className="status-badge" aria-label="Batch status: Enrollment open">
        <Users className="status-icon" aria-hidden="true" />
        <span className="status-copy">
          <span className="status-label">BATCH STATUS</span>
          <span className="status-value">Enrollment open</span>
        </span>
      </div>
    </section>
  );
}
