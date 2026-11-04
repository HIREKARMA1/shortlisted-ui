'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

function errorDetail(error: unknown, fallback: string): string {
  const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return detail || fallback;
}

export function useOtpVerification({
  email,
  otp,
  verify,
  successMessage,
  fallbackError,
}: {
  email: string;
  otp: string;
  verify: (email: string, otp: string) => Promise<unknown>;
  successMessage: string;
  fallbackError: string;
}) {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seen = useRef('');
  const verifyRef = useRef(verify);
  verifyRef.current = verify;

  useEffect(() => {
    if (otp.length !== 6) {
      seen.current = '';
      setVerified(false);
      setVerifying(false);
      setError(null);
      return;
    }

    const key = `${email}:${otp}`;
    if (seen.current === key) return;
    seen.current = key;

    let active = true;
    let finished = false;
    setVerifying(true);
    setVerified(false);
    setError(null);

    verifyRef
      .current(email, otp)
      .then(() => {
        finished = true;
        if (!active) return;
        setVerified(true);
        toast.success(successMessage);
      })
      .catch((err: unknown) => {
        finished = true;
        if (!active) return;
        setVerified(false);
        setError(errorDetail(err, fallbackError));
      })
      .finally(() => {
        if (active) setVerifying(false);
      });

    return () => {
      active = false;
      if (!finished && seen.current === key) seen.current = '';
    };
  }, [email, otp, successMessage, fallbackError]);

  return { verified, verifying, error };
}
