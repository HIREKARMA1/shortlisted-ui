'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound, Loader2, Lock, Mail, Phone, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useGuestOnly, useSession } from '@/hooks/useSession';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { Button } from '@/components/ui/Button';

const FIELDS = ['name', 'email', 'password', 'phone', 'otp'] as const;
type FieldKey = (typeof FIELDS)[number];

const OTP_COOLDOWN_SECONDS = 60;

export function RegisterFormView() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { session, ready } = useSession();
  useGuestOnly();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [form, setForm] = useState<Record<FieldKey, string>>(
    Object.fromEntries(FIELDS.map((k) => [k, ''])) as Record<FieldKey, string>
  );

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  if (!ready || session) return null;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const otpValid = /^\d{6}$/.test(form.otp.trim());
  const canSubmit = otpSent && otpValid && form.name.trim() && form.password.trim().length >= 8;

  const handleSendOtp = async () => {
    if (!emailValid) {
      toast.error(t('auth.register.otp.invalidEmail'));
      return;
    }
    setSendingOtp(true);
    try {
      await api.sendRegistrationOtp(form.email.trim());
      setOtpSent(true);
      setResendIn(OTP_COOLDOWN_SECONDS);
      toast.success(t('auth.register.otp.sent'));
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
      await api.register({
        name: form.name,
        email: form.email.trim(),
        otp: form.otp.trim(),
        password: form.password,
        ...(form.phone ? { phone: form.phone } : {}),
      });
      toast.success(t('auth.register.success'));
      await login(form.email.trim(), form.password, 'student');
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
      kicker={t('auth.register.kicker')}
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      footer={
        <>
          {t('auth.register.footer')}{' '}
          <Link href="/auth/login" className="font-semibold text-brand-blue">
            {t('auth.register.footerLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3.5">
        <AuthField
          name="name"
          label={t('auth.register.fields.name')}
          icon={User}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          autoComplete="name"
          placeholder={t('auth.register.placeholders.name')}
        />
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            {t('auth.register.fields.email')}
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-blue/45"
                aria-hidden
              />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value, otp: '' });
                  setOtpSent(false);
                }}
                required
                autoComplete="email"
                placeholder={t('auth.register.placeholders.email')}
                className="w-full rounded-xl border border-line-default bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink-primary outline-none transition-shadow placeholder:text-ink-muted/60 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/15"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={!emailValid || sendingOtp || resendIn > 0}
              onClick={handleSendOtp}
              className="h-[42px] shrink-0 rounded-xl px-3 text-xs sm:px-4 sm:text-sm"
            >
              {sendingOtp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : resendIn > 0 ? (
                t('auth.register.otp.resendIn', { seconds: resendIn })
              ) : otpSent ? (
                t('auth.register.otp.resend')
              ) : (
                t('auth.register.otp.send')
              )}
            </Button>
          </div>
          {otpSent && (
            <p className="text-[11px] leading-relaxed text-ink-muted">{t('auth.register.otp.hint')}</p>
          )}
        </div>
        {otpSent && (
          <AuthField
            name="otp"
            label={t('auth.register.fields.otp')}
            icon={KeyRound}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            required
            placeholder={t('auth.register.placeholders.otp')}
          />
        )}
        <div className="grid gap-3.5 sm:grid-cols-2">
          <AuthField
            name="phone"
            label={t('auth.register.fields.phone')}
            icon={Phone}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            autoComplete="tel"
            placeholder={t('auth.register.placeholders.phone')}
          />
          <AuthField
            name="password"
            label={t('auth.register.fields.password')}
            icon={Lock}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="new-password"
            placeholder={t('auth.register.placeholders.password')}
          />
        </div>
        <p className="text-[11px] leading-relaxed text-ink-muted">{t('auth.register.terms')}</p>
        <Button type="submit" fullWidth variant="accent" disabled={loading || !canSubmit} className="h-11 rounded-xl">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('auth.register.submitting')}
            </span>
          ) : (
            t('auth.register.submit')
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
