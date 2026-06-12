'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Lock, Mail, Phone, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useGuestOnly, useSession } from '@/hooks/useSession';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { Button } from '@/components/ui/Button';

const FIELDS = ['name', 'email', 'password', 'phone'] as const;
type FieldKey = (typeof FIELDS)[number];

export function RegisterFormView() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { session, ready } = useSession();
  useGuestOnly();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<FieldKey, string>>(
    Object.fromEntries(FIELDS.map((k) => [k, ''])) as Record<FieldKey, string>
  );

  if (!ready || session) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
        ...(form.phone ? { phone: form.phone } : {}),
      });
      toast.success(t('auth.register.success'));
      await login(form.email, form.password, 'student');
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
        <div className="grid gap-3.5 sm:grid-cols-2">
          <AuthField
            name="email"
            label={t('auth.register.fields.email')}
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
            placeholder={t('auth.register.placeholders.email')}
          />
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
        </div>
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
        <p className="text-[11px] leading-relaxed text-ink-muted">{t('auth.register.terms')}</p>
        <Button type="submit" fullWidth variant="accent" disabled={loading} className="h-11 rounded-xl">
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
