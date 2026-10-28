'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api, type UserType } from '@/lib/api';
import { getLoginPathForRole } from '@/lib/auth/login-routes';
import { useGuestOnly, useSession } from '@/hooks/useSession';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { OtpCodePanel } from '@/components/auth/OtpCodePanel';
import { useOtpVerification } from '@/components/auth/useOtpVerification';
import { useOtpWindow } from '@/components/auth/useOtpWindow';
import { Button } from '@/components/ui/Button';
import { formatOtpClock, otpStatusFromError, statusFromSend } from '@/lib/otp-clock';

type Step = 'email' | 'code' | 'password';

function parseRole(value: string | null): UserType | undefined {
  if (value === 'student' || value === 'admin' || value === 'super_admin') {
    return value;
  }
  return undefined;
}

export function ForgotPasswordFormView() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, ready } = useSession();
  useGuestOnly();

  const fixedRole = useMemo(() => parseRole(searchParams.get('role')), [searchParams]);
  const isSuperAdmin = fixedRole === 'super_admin';
  const isCoordinator = fixedRole === 'admin';

  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const otpWindow = useOtpWindow();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetRole: UserType = fixedRole ?? 'student';
  const otpCheck = useOtpVerification({
    email: email.trim(),
    otp: otpWindow.codeSeconds > 0 ? otp : '',
    verify: (address, code) => api.verifyForgotPasswordOtp(address, code, resetRole),
    successMessage: t('auth.forgotPassword.otp.verified'),
    fallbackError: t('common.errors.generic'),
  });

  if (!ready || session) return null;

  const role: UserType = resetRole;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const otpValid = /^\d{6}$/.test(otp.trim());
  const passwordValid = password.trim().length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const confirmPasswordError =
    confirmPassword.length > 0 && !passwordsMatch
      ? t('auth.forgotPassword.errors.passwordMismatch')
      : undefined;
  const canReset =
    emailValid && otpValid && otpCheck.verified && otpWindow.codeSeconds > 0 && passwordValid && passwordsMatch;

  const loginHref = getLoginPathForRole(fixedRole);

  const forgotKicker = isSuperAdmin
    ? t('auth.forgotPassword.internalKicker')
    : isCoordinator
      ? t('auth.forgotPassword.coordinatorKicker')
      : t('auth.forgotPassword.kicker');

  const title =
    step === 'code'
      ? t('auth.forgotPassword.codeTitle')
      : step === 'password'
        ? t('auth.forgotPassword.passwordTitle')
        : t('auth.forgotPassword.title');
  const subtitle =
    step === 'code'
      ? t('auth.forgotPassword.codeSubtitle', { email: email.trim() })
      : step === 'password'
        ? t('auth.forgotPassword.passwordSubtitle', { email: email.trim() })
        : t('auth.forgotPassword.subtitle');

  const clearCode = () => {
    setOtp('');
    otpWindow.setStatus(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSendOtp = async () => {
    if (!emailValid) {
      toast.error(t('auth.forgotPassword.errors.invalidEmail'));
      return;
    }
    setSendingOtp(true);
    try {
      const sent = await api.sendForgotPasswordOtp(email.trim(), role);
      setOtp('');
      otpWindow.setStatus(statusFromSend(sent));
      setStep('code');
      toast.success(t('auth.forgotPassword.otp.sent'));
    } catch (err: unknown) {
      const parsed = otpStatusFromError(err);
      if (parsed.status) {
        setOtp('');
        otpWindow.setStatus(parsed.status);
        setStep('code');
      }
      toast.error(parsed.message || t('common.errors.generic'));
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'email') {
      await handleSendOtp();
      return;
    }
    if (step === 'code') {
      if (otpCheck.verified && otpWindow.codeSeconds > 0) setStep('password');
      return;
    }
    if (!canReset) return;
    setLoading(true);
    try {
      await api.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
        user_type: role,
      });
      toast.success(t('auth.forgotPassword.success'));
      router.push(loginHref);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      fitViewport
      kicker={forgotKicker}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          {t('auth.forgotPassword.footer')}{' '}
          <Link href={loginHref} className="font-semibold text-brand-blue">
            {t('auth.forgotPassword.footerLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {step === 'email' && (
          <>
            <AuthField
              name="email"
              label={t('auth.login.emailLabel')}
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder={t('auth.login.placeholders.email')}
            />
            <Button
              type="submit"
              fullWidth
              className="h-11 rounded-xl"
              disabled={!emailValid || sendingOtp}
            >
              {sendingOtp ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('auth.forgotPassword.otp.sending')}
                </span>
              ) : (
                t('auth.forgotPassword.otp.send')
              )}
            </Button>
          </>
        )}

        {step === 'code' && (
          <>
            <OtpCodePanel
              email={email.trim()}
              value={otp}
              onChange={setOtp}
              codeSecondsLeft={otpWindow.codeSeconds}
              clockSecondsLeft={otpWindow.clockSeconds}
              lockedOut={otpWindow.lockedOut}
              sending={sendingOtp}
              onResend={handleSendOtp}
              verified={otpCheck.verified}
              verifying={otpCheck.verifying}
              error={otpCheck.error}
              labels={{
                timeRemaining: t('auth.forgotPassword.otp.timeRemaining'),
                attempts: t('auth.forgotPassword.otp.attempts'),
                attemptsValue: t('auth.forgotPassword.otp.attemptsValue', {
                  remaining: otpWindow.remaining,
                  max: otpWindow.max,
                }),
                sentTo: t('auth.forgotPassword.otp.sentTo'),
                expires: t('auth.forgotPassword.otp.expires'),
                expired: t('auth.forgotPassword.otp.expired'),
                lockout: t('auth.forgotPassword.otp.lockout'),
                resend: t('auth.forgotPassword.otp.resend'),
                resendIn: t('auth.forgotPassword.otp.resend'),
                groupLabel: t('auth.forgotPassword.fields.otp'),
                verified: t('auth.forgotPassword.otp.verified'),
                verifying: t('auth.forgotPassword.otp.verifying'),
              }}
            />
            <Button
              type="submit"
              fullWidth
              className="h-11 rounded-xl"
              disabled={!otpCheck.verified || otpWindow.codeSeconds <= 0}
            >
              {t('auth.forgotPassword.continue')}
            </Button>
            <button
              type="button"
              className="w-full text-center text-sm font-semibold text-brand-blue"
              onClick={() => {
                clearCode();
                setStep('email');
              }}
            >
              {t('auth.forgotPassword.changeEmail')}
            </button>
          </>
        )}

        {step === 'password' && (
          <>
            <p className="flex items-center justify-between text-sm text-ink-muted">
              <span>{t('auth.forgotPassword.otp.timeRemaining')}</span>
              <span className={otpWindow.codeSeconds <= 0 ? 'font-mono font-semibold text-brand-red' : 'font-mono font-semibold text-ink-primary'}>
                {formatOtpClock(otpWindow.codeSeconds)}
              </span>
            </p>
            {otpWindow.codeSeconds <= 0 && (
              <p className="text-sm text-brand-red">{t('auth.forgotPassword.otp.expired')}</p>
            )}
            <AuthField
              name="password"
              label={t('auth.forgotPassword.fields.password')}
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder={t('auth.forgotPassword.placeholders.password')}
            />
            <AuthField
              name="confirmPassword"
              label={t('auth.forgotPassword.fields.confirmPassword')}
              icon={Lock}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder={t('auth.forgotPassword.placeholders.confirmPassword')}
              error={confirmPasswordError}
            />
            <Button type="submit" fullWidth disabled={loading || !canReset} className="h-11 rounded-xl">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('auth.forgotPassword.submitting')}
                </span>
              ) : (
                t('auth.forgotPassword.submit')
              )}
            </Button>
            <button
              type="button"
              className="w-full text-center text-sm font-semibold text-brand-blue"
              onClick={() => setStep('code')}
            >
              {t('auth.forgotPassword.backToCode')}
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  );
}
