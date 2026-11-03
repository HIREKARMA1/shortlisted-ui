'use client';

import { useRef } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatOtpClock } from '@/lib/otp-clock';
import { cn } from '@/lib/utils';

const LENGTH = 6;

export type OtpPanelLabels = {
  timeRemaining: string;
  attempts: string;
  attemptsValue: string;
  sentTo: string;
  expires: string;
  expired: string;
  lockout: string;
  resend: string;
  resendIn: string;
  groupLabel: string;
  verified: string;
  verifying: string;
};

type OtpCodePanelProps = {
  email: string;
  value: string;
  onChange: (next: string) => void;
  codeSecondsLeft: number;
  clockSecondsLeft: number;
  lockedOut?: boolean;
  sending: boolean;
  onResend: () => void;
  verified?: boolean;
  verifying?: boolean;
  error?: string | null;
  labels: OtpPanelLabels;
};

export function OtpCodePanel({
  email,
  value,
  onChange,
  codeSecondsLeft,
  clockSecondsLeft,
  lockedOut = false,
  sending,
  onResend,
  verified = false,
  verifying = false,
  error = null,
  labels,
}: OtpCodePanelProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const expired = codeSecondsLeft <= 0 && !verified && !lockedOut;
  const entryClosed = expired || lockedOut;
  const digits = Array.from({ length: LENGTH }, (_, index) => value[index] ?? '');

  const focusAt = (index: number) => {
    const target = Math.max(0, Math.min(LENGTH - 1, index));
    refs.current[target]?.focus();
  };

  const write = (next: string, focusIndex: number) => {
    onChange(next.replace(/\D/g, '').slice(0, LENGTH));
    requestAnimationFrame(() => focusAt(focusIndex));
  };

  return (
    <div className="space-y-2.5">
      <div
        className="flex justify-center gap-2"
        role="group"
        aria-label={labels.groupLabel}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            disabled={entryClosed || verified}
            aria-label={`${labels.groupLabel} ${index + 1}`}
            onChange={(event) => {
              const char = event.target.value.replace(/\D/g, '').slice(-1);
              if (!char) {
                write(value.slice(0, index) + value.slice(index + 1), index);
                return;
              }
              write(value.slice(0, index) + char + value.slice(index + 1), index + 1);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !digits[index] && index > 0) {
                event.preventDefault();
                write(value.slice(0, index - 1) + value.slice(index), index - 1);
              }
              if (event.key === 'ArrowLeft' && index > 0) {
                event.preventDefault();
                focusAt(index - 1);
              }
              if (event.key === 'ArrowRight' && index < LENGTH - 1) {
                event.preventDefault();
                focusAt(index + 1);
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
              if (!pasted) return;
              write(pasted, pasted.length);
            }}
            className={cn(
              'h-11 w-10 rounded-lg border-2 bg-white text-center font-mono text-lg font-semibold outline-none transition-shadow sm:w-11',
              verified
                ? 'cursor-default border-brand-green bg-brand-green/10 text-brand-green'
                : entryClosed
                  ? 'cursor-not-allowed border-line-default text-ink-muted'
                  : 'border-line-default text-ink-primary focus:border-brand-blue focus:ring-2 focus:ring-brand-sky/25'
            )}
          />
        ))}
      </div>

      {verified ? (
        <div className="flex items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/10 px-3 py-2.5 text-sm font-semibold text-brand-green">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
          {labels.verified}
        </div>
      ) : (
        <>
          {verifying && (
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-brand-blue">
              <Loader2 className="h-4 w-4 animate-spin" />
              {labels.verifying}
            </p>
          )}
          <div className="rounded-xl border border-line-default bg-soft/70 p-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-ink-muted">{labels.timeRemaining}</span>
              <span
                className={cn(
                  'font-mono text-base font-semibold tabular-nums',
                  lockedOut || expired ? 'text-brand-red' : 'text-ink-primary'
                )}
              >
                {formatOtpClock(clockSecondsLeft)}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="text-ink-muted">{labels.attempts}</span>
              <span className="font-semibold tabular-nums text-ink-primary">{labels.attemptsValue}</span>
            </div>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="mt-3 h-10 rounded-xl"
              disabled={sending || verifying || lockedOut || clockSecondsLeft > 0}
              onClick={onResend}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : labels.resend}
            </Button>
          </div>

          <div
            className={cn(
              'rounded-xl border px-3 py-2.5 text-sm',
              lockedOut
                ? 'border-brand-yellow/60 bg-brand-yellow/20 text-ink-primary'
                : error || expired
                  ? 'border-brand-red/30 bg-brand-red/10 text-brand-red'
                  : 'border-brand-yellow/50 bg-brand-yellow/15 text-ink-primary'
            )}
          >
            {lockedOut ? (
              <p>{labels.lockout}</p>
            ) : error ? (
              <p>{error}</p>
            ) : expired ? (
              <p>{labels.expired}</p>
            ) : (
              <>
                <p>
                  {labels.sentTo} <strong className="break-all">{email}</strong>
                </p>
                <p className="mt-1 text-xs text-ink-secondary">{labels.expires}</p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
