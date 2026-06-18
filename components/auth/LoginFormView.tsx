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
import { RoleSelector } from '@/components/auth/RoleSelector';
import { Button } from '@/components/ui/Button';

const PUBLIC_ROLES: UserType[] = ['student', 'admin'];

type LoginFormViewProps = {
  /** Fixed role for internal login links — hides the role selector */
  fixedRole?: UserType;
};

export function LoginFormView({ fixedRole }: LoginFormViewProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { session, ready } = useSession();
  useGuestOnly();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>(fixedRole ?? 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!ready || session) return null;

  const isInternal = fixedRole === 'super_admin';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, fixedRole ?? userType);
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
      kicker={isInternal ? t('auth.loginInternal.kicker') : t('auth.login.kicker')}
      title={isInternal ? t('auth.loginInternal.title') : t('auth.login.title')}
      subtitle={isInternal ? t('auth.loginInternal.subtitle') : t('auth.login.subtitle')}
      footer={
        isInternal ? undefined : (
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
        {!fixedRole && (
          <RoleSelector
            label={t('auth.login.roleLabel')}
            value={userType}
            onChange={setUserType}
            options={PUBLIC_ROLES.map((role) => ({
              value: role,
              label: t(`auth.login.roles.${role}`),
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
        <Button type="submit" fullWidth disabled={loading} className="h-11 rounded-xl">
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
