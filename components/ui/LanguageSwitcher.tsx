'use client';

import { useTranslation } from '@/lib/i18n/context';
import { LOCALE_LABELS, LOCALES } from '@/lib/i18n/types';
import { Select } from './Select';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <Select
      label={t('common.language.label')}
      value={locale}
      onChange={(e) => setLocale(e.target.value as typeof locale)}
      options={LOCALES.map((code) => ({
        value: code,
        label: LOCALE_LABELS[code],
      }))}
      aria-label={t('common.language.label')}
    />
  );
}
