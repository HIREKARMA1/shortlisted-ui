'use client';

import { useEffect, useState } from 'react';
import { deriveOtpWindow, type OtpRateStatus } from '@/lib/otp-clock';

export function useOtpWindow() {
  const [status, setStoredStatus] = useState<OtpRateStatus | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const setStatus = (next: OtpRateStatus | null) => {
    setNow(Date.now());
    setStoredStatus(next);
  };

  useEffect(() => {
    if (!status?.last_otp_sent_at) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  return { status, setStatus, ...deriveOtpWindow(status, now) };
}
