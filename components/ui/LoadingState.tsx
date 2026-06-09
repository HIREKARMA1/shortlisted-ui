'use client';

import { useTranslation } from '@/lib/i18n/context';

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-page">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-brand-blue" />
      <p className="mt-4 text-sm text-ink-muted">{t('common.actions.loading')}</p>
    </div>
  );
}
