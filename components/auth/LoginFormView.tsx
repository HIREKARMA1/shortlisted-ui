'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useGuestOnly, useSession } from '@/hooks/useSession';
import { UserType } from '@/lib/api';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { LegalConsentCheckbox } from '@/components/auth/LegalConsentCheckbox';
import { Button } from '@/components/ui/Button';

type LoginFormViewProps = {
  /** Fixed role for internal login links - hides the role selector */
  fixedRole?: UserType;
};

export function LoginFormView({ fixedRole }: LoginFormViewProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { session, ready } = useSession();
  useGuestOnly();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!ready || session) return null;

  const isSuperAdmin = fixedRole === 'super_admin';
  const isCoordinator = fixedRole === 'admin';
  const isTeamLogin = isSuperAdmin || isCoordinator;

  const kicker = isSuperAdmin
    ? t('auth.loginInternal.kicker')
    : isCoordinator
      ? t('auth.loginCoordinator.kicker')
      : t('auth.login.kicker');
  const title = isSuperAdmin
    ? t('auth.loginInternal.title')
    : isCoordinator
      ? t('auth.loginCoordinator.title')
      : t('auth.login.title');
  const subtitle = isSuperAdmin
    ? t('auth.loginInternal.subtitle')
    : isCoordinator
      ? t('auth.loginCoordinator.subtitle')
      : t('auth.login.subtitle');

  const forgotPasswordHref = fixedRole
    ? `/auth/forgot-password?role=${fixedRole}`
    : '/auth/forgot-password';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const redirectTo = new URLSearchParams(window.location.search).get('redirect');
      await login(email, password, fixedRole ?? 'student', redirectTo);
      toast.success(t('auth.login.success'));
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
      kicker={kicker}
      title={title}
      subtitle={subtitle}
      footer={
        isTeamLogin ? undefined : (
          <>
            {t('auth.login.footer')}{' '}
            <Link href="/auth/register" className="font-semibold text-brand-orange">
              {t('auth.login.footerLink')}
            </Link>
          </>
        )
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
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
        <AuthField
          name="password"
          label={t('auth.login.passwordLabel')}
          icon={Lock}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder={t('auth.login.placeholders.password')}
        />
        <div className="text-right">
          <Link
            href={forgotPasswordHref}
            className="text-sm font-medium text-brand-blue hover:text-brand-sky"
          >
            {t('auth.login.forgotPassword')}
          </Link>
        </div>
        <LegalConsentCheckbox
          id="login-legal-consent"
          checked={agreedToTerms}
          onCheckedChange={setAgreedToTerms}
        />
        <Button type="submit" fullWidth disabled={loading || !agreedToTerms} className="h-11 rounded-xl">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('auth.login.submitting')}
            </span>
          ) : (
            t('auth.login.submit')
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
