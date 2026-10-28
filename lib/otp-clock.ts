export const OTP_CODE_SECONDS = 120;
export const OTP_LOCKOUT_SECONDS = 600;
export const OTP_SEND_LIMIT = 3;

export type OtpRateStatus = {
  otp_request_count: number;
  max_attempts: number;
  cooldown_seconds: number;
  lockout_seconds: number;
  last_otp_sent_at: string | null;
  lockout_until: string | null;
  remaining_attempts: number;
  is_locked_out: boolean;
  can_request: boolean;
};

export type OtpWindowView = {
  clockSeconds: number;
  codeSeconds: number;
  lockedOut: boolean;
  remaining: number;
  max: number;
};

export function formatOtpClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function freshOtpStatus(seconds = OTP_CODE_SECONDS): OtpRateStatus {
  return {
    otp_request_count: 1,
    max_attempts: OTP_SEND_LIMIT,
    cooldown_seconds: seconds,
    lockout_seconds: OTP_LOCKOUT_SECONDS,
    last_otp_sent_at: new Date().toISOString(),
    lockout_until: null,
    remaining_attempts: OTP_SEND_LIMIT - 1,
    is_locked_out: false,
    can_request: false,
  };
}

export function deriveOtpWindow(status: OtpRateStatus | null, now = Date.now()): OtpWindowView {
  const max = status?.max_attempts ?? OTP_SEND_LIMIT;
  const idle: OtpWindowView = { clockSeconds: 0, codeSeconds: 0, lockedOut: false, remaining: max, max };
  if (!status?.last_otp_sent_at || status.otp_request_count <= 0) return idle;

  const sent = new Date(status.last_otp_sent_at).getTime();
  if (Number.isNaN(sent)) return idle;

  const cooldownMs = (status.cooldown_seconds || OTP_CODE_SECONDS) * 1000;
  const codeEnd = sent + cooldownMs;
  const lockoutEnd = status.lockout_until ? new Date(status.lockout_until).getTime() : 0;
  const codeSeconds = Math.max(0, Math.ceil((codeEnd - now) / 1000));
  const count = status.otp_request_count;

  if (count >= max && lockoutEnd > 0) {
    if (now < codeEnd) {
      return { clockSeconds: codeSeconds, codeSeconds, lockedOut: false, remaining: 0, max };
    }
    if (now < lockoutEnd) {
      return {
        clockSeconds: Math.max(1, Math.ceil((lockoutEnd - now) / 1000)),
        codeSeconds: 0,
        lockedOut: true,
        remaining: 0,
        max,
      };
    }
    return { clockSeconds: 0, codeSeconds: 0, lockedOut: false, remaining: max, max };
  }

  return {
    clockSeconds: codeSeconds,
    codeSeconds,
    lockedOut: false,
    remaining: Math.max(0, max - count),
    max,
  };
}

export function otpStatusFromError(error: unknown): { message: string; status: OtpRateStatus | null } {
  const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  if (detail && typeof detail === 'object' && 'rate_limit' in detail) {
    const body = detail as { message?: string; rate_limit?: OtpRateStatus };
    return { message: body.message || 'Please wait before requesting another code.', status: body.rate_limit ?? null };
  }
  if (typeof detail === 'string' && detail) return { message: detail, status: null };
  return { message: '', status: null };
}

export function statusFromSend(sent: { expires_in_seconds?: number; rate_limit?: OtpRateStatus }): OtpRateStatus {
  if (sent.rate_limit) return sent.rate_limit;
  return freshOtpStatus(sent.expires_in_seconds || OTP_CODE_SECONDS);
}
