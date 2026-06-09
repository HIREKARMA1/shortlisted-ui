'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/lib/api';
import { PageContainer } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Text } from '@/components/ui/Text';

export function LoginFormView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <main className="min-h-screen bg-surface-page">
      <PageContainer className="max-w-md">
        <div className="mb-6 flex justify-end">
          <div className="w-40">
            <LanguageSwitcher />
          </div>
        </div>
        <Text variant="title">{t('auth.login.title')}</Text>
        <Card className="mt-6">
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
            />
            <Input
              label={t('auth.login.passwordLabel')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t('auth.login.submitting') : t('auth.login.submit')}
            </Button>
          </form>
        </Card>
        <Text variant="muted" className="mt-4 text-center">
          {t('auth.login.footer')}{' '}
          <Link href="/auth/register" className="font-medium text-primary-600">
            {t('auth.login.footerLink')}
          </Link>
        </Text>
      </PageContainer>
    </main>
  );
}
