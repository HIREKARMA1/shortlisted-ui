'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { PageContainer } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Text } from '@/components/ui/Text';

const FIELD_KEYS = [
  'name',
  'email',
  'password',
  'phone',
  'branch',
  'college',
  'graduation_year',
  'skills',
  'preferred_roles',
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];

export function RegisterFormView() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<FieldKey, string>>(
    Object.fromEntries(FIELD_KEYS.map((k) => [k, ''])) as Record<FieldKey, string>
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register({
        ...form,
        graduation_year: form.graduation_year ? Number(form.graduation_year) : undefined,
      });
      toast.success(t('auth.register.success'));
      router.push('/auth/login');
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
      <PageContainer className="max-w-lg">
        <div className="mb-6 flex justify-end">
          <div className="w-40">
            <LanguageSwitcher />
          </div>
        </div>
        <Text variant="title">{t('auth.register.title')}</Text>
        <Text variant="subtitle" className="mt-2">
          {t('auth.register.subtitle')}
        </Text>
        <Card className="mt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {FIELD_KEYS.map((field) => (
              <Input
                key={field}
                name={field}
                label={t(`auth.register.fields.${field}`)}
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required={['name', 'email', 'password'].includes(field)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            ))}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t('auth.register.submitting') : t('auth.register.submit')}
            </Button>
          </form>
        </Card>
        <Text variant="muted" className="mt-4 text-center">
          {t('auth.register.footer')}{' '}
          <Link href="/auth/login" className="font-medium text-primary-600">
            {t('auth.register.footerLink')}
          </Link>
        </Text>
      </PageContainer>
    </main>
  );
}
