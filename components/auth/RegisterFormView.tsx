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
import { LegalConsentCheckbox } from '@/components/auth/LegalConsentCheckbox';
import { Button } from '@/components/ui/Button';
import { getPersonNameError, normalizePersonName } from '@/lib/validation/personName';

const FIELDS = ['name', 'email', 'password', 'confirmPassword', 'phone', 'otp'] as const;
type FieldKey = (typeof FIELDS)[number];

const OTP_COOLDOWN_SECONDS = 60;
const REQUIRED_MESSAGE = 'This field is required.';

export function RegisterFormView() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { session, ready } = useSession();
  useGuestOnly();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [form, setForm] = useState<Record<FieldKey, string>>(
    Object.fromEntries(FIELDS.map((k) => [k, ''])) as Record<FieldKey, string>
  );

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const type = new URLSearchParams(window.location.search).get('type');
    if ((type || '').toLowerCase() === 'whatsapp') {
      sessionStorage.setItem('signup_channel', 'whatsapp');
    }
  }, []);

  if (!ready || session) return null;

  const nameInvalidMessage = t('auth.register.errors.invalidName');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const otpValid = /^\d{6}$/.test(form.otp.trim());
  const passwordValid = form.password.trim().length >= 8;
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0;
  const phoneValid = /^\d{10}$/.test(form.phone);

  const validateField = (key: FieldKey, values: Record<FieldKey, string> = form): string | undefined => {
    switch (key) {
      case 'name':
        return getPersonNameError(values.name, {
          required: true,
          invalidMessage: nameInvalidMessage,
        });
      case 'email':
        if (!values.email.trim()) return REQUIRED_MESSAGE;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
          return t('auth.register.otp.invalidEmail');
        }
        return undefined;
      case 'password':
        if (!values.password.trim()) return REQUIRED_MESSAGE;
        if (values.password.trim().length < 8) {
          return t('auth.register.errors.passwordTooShort');
        }
        return undefined;
      case 'confirmPassword':
        if (!values.confirmPassword.trim()) return REQUIRED_MESSAGE;
        if (values.password !== values.confirmPassword) {
          return t('auth.register.errors.passwordMismatch');
        }
        return undefined;
      case 'phone':
        if (!values.phone.trim()) return REQUIRED_MESSAGE;
        if (!/^\d{10}$/.test(values.phone)) {
          return t('auth.register.errors.invalidPhone');
        }
        return undefined;
      case 'otp':
        if (!otpSent) return undefined;
        if (!values.otp.trim()) return REQUIRED_MESSAGE;
        if (!/^\d{6}$/.test(values.otp.trim())) {
          return t('auth.register.errors.invalidOtp');
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const validatePreOtpFields = (): boolean => {
    const keys: FieldKey[] = ['name', 'email', 'password', 'confirmPassword', 'phone'];
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    for (const key of keys) {
      const err = validateField(key);
      if (err) nextErrors[key] = err;
    }
    if (!agreedToTerms) {
      toast.error(t('auth.register.errors.termsRequired'));
    }
    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
    setTouched((prev) => ({
      ...prev,
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    }));
    return Object.keys(nextErrors).length === 0 && agreedToTerms;
  };

  const validateAllForSubmit = (): boolean => {
    const keys: FieldKey[] = ['name', 'email', 'password', 'confirmPassword', 'phone', 'otp'];
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    for (const key of keys) {
      const err = validateField(key);
      if (err) nextErrors[key] = err;
    }
    setFieldErrors(nextErrors);
    setTouched(Object.fromEntries(keys.map((k) => [k, true])) as Partial<Record<FieldKey, boolean>>);
    return Object.keys(nextErrors).length === 0 && agreedToTerms;
  };

  const clearFieldErrorIfValid = (key: FieldKey, nextForm: Record<FieldKey, string>) => {
    const err = validateField(key, nextForm);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[key] = err;
      else delete next[key];
      return next;
    });
  };

  const handleBlur = (key: FieldKey) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const err = validateField(key);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[key] = err;
      else delete next[key];
      return next;
    });
  };

  const showError = (key: FieldKey) => (touched[key] ? fieldErrors[key] : undefined);

  const canSendCode =
    !validateField('name') &&
    !validateField('email') &&
    !validateField('password') &&
    !validateField('confirmPassword') &&
    !validateField('phone') &&
    agreedToTerms;

  const canSubmit =
    otpSent &&
    otpValid &&
    !validateField('name') &&
    !validateField('email') &&
    passwordValid &&
    passwordsMatch &&
    phoneValid &&
    agreedToTerms;

  const handleSendOtp = async () => {
    if (!validatePreOtpFields()) return;
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
    if (!otpSent) {
      await handleSendOtp();
      return;
    }
    if (!validateAllForSubmit()) return;
    setLoading(true);
    try {
      const channel =
        typeof window !== 'undefined' && sessionStorage.getItem('signup_channel') === 'whatsapp'
          ? 'whatsapp'
          : 'web';
      await api.register({
        name: normalizePersonName(form.name),
        email: form.email.trim(),
        otp: form.otp.trim(),
        password: form.password,
        phone: form.phone,
        signup_channel: channel,
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
      <form onSubmit={onSubmit} className="space-y-2.5" noValidate>
        <AuthField
          compact
          name="name"
          label={t('auth.register.fields.name')}
          icon={User}
          value={form.name}
          onChange={(e) => {
            const nextForm = { ...form, name: e.target.value };
            setForm(nextForm);
            if (touched.name) clearFieldErrorIfValid('name', nextForm);
          }}
          onBlur={() => handleBlur('name')}
          required
          autoComplete="name"
          placeholder={t('auth.register.placeholders.name')}
          error={showError('name')}
        />
        <AuthField
          compact
          name="email"
          label={t('auth.register.fields.email')}
          icon={Mail}
          type="email"
          value={form.email}
          onChange={(e) => {
            const nextForm = { ...form, email: e.target.value, otp: '' };
            setForm(nextForm);
            setOtpSent(false);
            setResendIn(0);
            if (touched.email) clearFieldErrorIfValid('email', nextForm);
          }}
          onBlur={() => handleBlur('email')}
          required
          autoComplete="email"
          placeholder={t('auth.register.placeholders.email')}
          error={showError('email')}
        />
        {otpSent && (
          <AuthField
            compact
            name="otp"
            label={t('auth.register.fields.otp')}
            icon={KeyRound}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={form.otp}
            onChange={(e) => {
              const nextForm = { ...form, otp: e.target.value.replace(/\D/g, '').slice(0, 6) };
              setForm(nextForm);
              if (touched.otp) clearFieldErrorIfValid('otp', nextForm);
            }}
            onBlur={() => handleBlur('otp')}
            required
            placeholder={t('auth.register.placeholders.otp')}
            error={showError('otp')}
          />
        )}
        {otpSent && (
          <p className="text-[10px] leading-relaxed text-ink-muted">
            {t('auth.register.otp.hint')}{' '}
            <button
              type="button"
              disabled={!canSendCode || sendingOtp || resendIn > 0}
              onClick={handleSendOtp}
              className="font-semibold text-brand-blue underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline"
            >
              {sendingOtp
                ? t('auth.register.otp.sending')
                : resendIn > 0
                  ? t('auth.register.otp.resendIn', { seconds: resendIn })
                  : t('auth.register.otp.resend')}
            </button>
          </p>
        )}
        <div className="grid gap-2.5 sm:grid-cols-2">
          <AuthField
            compact
            name="phone"
            label={t('auth.register.fields.phone')}
            icon={Phone}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={(e) => {
              const nextForm = { ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) };
              setForm(nextForm);
              if (touched.phone) clearFieldErrorIfValid('phone', nextForm);
            }}
            onBlur={() => handleBlur('phone')}
            required
            autoComplete="tel"
            placeholder={t('auth.register.placeholders.phone')}
            error={showError('phone')}
          />
          <AuthField
            compact
            name="password"
            label={t('auth.register.fields.password')}
            icon={Lock}
            type="password"
            value={form.password}
            onChange={(e) => {
              const nextForm = { ...form, password: e.target.value };
              setForm(nextForm);
              if (touched.password) clearFieldErrorIfValid('password', nextForm);
              if (touched.confirmPassword) clearFieldErrorIfValid('confirmPassword', nextForm);
            }}
            onBlur={() => handleBlur('password')}
            required
            autoComplete="new-password"
            placeholder={t('auth.register.placeholders.password')}
            error={showError('password')}
          />
        </div>
        <AuthField
          compact
          name="confirmPassword"
          label={t('auth.register.fields.confirmPassword')}
          icon={Lock}
          type="password"
          value={form.confirmPassword}
          onChange={(e) => {
            const nextForm = { ...form, confirmPassword: e.target.value };
            setForm(nextForm);
            if (touched.confirmPassword) clearFieldErrorIfValid('confirmPassword', nextForm);
          }}
          onBlur={() => handleBlur('confirmPassword')}
          required
          autoComplete="new-password"
          placeholder={t('auth.register.placeholders.confirmPassword')}
          error={showError('confirmPassword')}
        />
        <LegalConsentCheckbox
          id="register-legal-consent"
          checked={agreedToTerms}
          onCheckedChange={setAgreedToTerms}
        />
        <Button
          type="submit"
          fullWidth
          variant="accent"
          disabled={loading || sendingOtp || (otpSent ? !canSubmit : !canSendCode)}
          className="h-10 rounded-xl"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('auth.register.submitting')}
            </span>
          ) : sendingOtp ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('auth.register.otp.sending')}
            </span>
          ) : otpSent ? (
            t('auth.register.submit')
          ) : (
            t('auth.register.sendCode')
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
