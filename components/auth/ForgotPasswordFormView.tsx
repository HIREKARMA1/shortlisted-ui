'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api, type UserType } from '@/lib/api';
import { useGuestOnly, useSession } from '@/hooks/useSession';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { Button } from '@/components/ui/Button';

const PUBLIC_ROLES: UserType[] = ['student', 'admin'];
const OTP_COOLDOWN_SECONDS = 60;

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
  const isInternal = fixedRole === 'super_admin';

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [userType, setUserType] = useState<UserType>(fixedRole ?? 'student');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (fixedRole) setUserType(fixedRole);
  }, [fixedRole]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  if (!ready || session) return null;

  const role = fixedRole ?? userType;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const otpValid = /^\d{6}$/.test(otp.trim());
  const passwordValid = password.trim().length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const confirmPasswordError =
    confirmPassword.length > 0 && !passwordsMatch
      ? t('auth.forgotPassword.errors.passwordMismatch')
      : undefined;
  const canSubmit = otpSent && emailValid && otpValid && passwordValid && passwordsMatch;

  const loginHref = isInternal ? '/auth/login/internal' : '/auth/login';

  const handleSendOtp = async () => {
    if (!emailValid) {
      toast.error(t('auth.forgotPassword.errors.invalidEmail'));
      return;
    }
    setSendingOtp(true);
    try {
      await api.sendForgotPasswordOtp(email.trim(), role);
      setOtpSent(true);
      setResendIn(OTP_COOLDOWN_SECONDS);
      toast.success(t('auth.forgotPassword.otp.sent'));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
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
      kicker={isInternal ? t('auth.forgotPassword.internalKicker') : t('auth.forgotPassword.kicker')}
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
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
        {!fixedRole && (
          <RoleSelector
            label={t('auth.login.roleLabel')}
            value={userType}
            onChange={setUserType}
            options={PUBLIC_ROLES.map((r) => ({
              value: r,
              label: t(`auth.login.roles.${r}`),
            }))}
          />
        )}

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

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <AuthField
              name="otp"
              label={t('auth.forgotPassword.fields.otp')}
              icon={KeyRound}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder={t('auth.forgotPassword.placeholders.otp')}
              disabled={!otpSent}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mb-0.5 h-11 shrink-0 rounded-xl px-4"
            disabled={!emailValid || sendingOtp || resendIn > 0}
            onClick={handleSendOtp}
          >
            {sendingOtp ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : resendIn > 0 ? (
              t('auth.forgotPassword.otp.resendIn', { seconds: String(resendIn) })
            ) : otpSent ? (
              t('auth.forgotPassword.otp.resend')
            ) : (
              t('auth.forgotPassword.otp.send')
            )}
          </Button>
        </div>

        {otpSent && (
          <p className="text-xs text-ink-muted">{t('auth.forgotPassword.otp.hint')}</p>
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
          disabled={!otpSent}
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
          disabled={!otpSent}
        />

        <Button type="submit" fullWidth disabled={loading || !canSubmit} className="h-11 rounded-xl">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('auth.forgotPassword.submitting')}
            </span>
          ) : (
            t('auth.forgotPassword.submit')
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
