'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useGuestOnly, useSession } from '@/hooks/useSession';
import { UserType } from '@/lib/api';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function LoginFormView() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { session, ready } = useSession();
  useGuestOnly();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!ready || session) return null;

  const roleOptions: UserType[] = ['student', 'admin', 'super_admin'];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, userType);
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
      title={t('auth.login.title')}
      footer={
        <>
          {t('auth.login.footer')}{' '}
          <Link href="/auth/register" className="link-brand font-medium">
            {t('auth.login.footerLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label={t('auth.login.roleLabel')}
          value={userType}
          onChange={(e) => setUserType(e.target.value as UserType)}
          options={roleOptions.map((role) => ({
            value: role,
            label: t(`auth.login.roles.${role}`),
          }))}
        />
        <Input
          label={t('auth.login.emailLabel')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label={t('auth.login.passwordLabel')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth disabled={loading} className="mt-2">
          {loading ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>
      </form>
    </AuthLayout>
  );
}
