'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { PRIVACY_URL, TERMS_URL } from '@/lib/legal-links';
import { Checkbox } from '@/components/ui/Checkbox';

type LegalConsentCheckboxProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function LegalConsentCheckbox({ id, checked, onCheckedChange }: LegalConsentCheckboxProps) {
  const { t } = useTranslation();

  return (
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      label={
        <span className="text-[11px] leading-relaxed text-ink-muted">
          {t('auth.legalConsent.prefix')}{' '}
          <Link
            href={TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-blue hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('auth.legalConsent.terms')}
          </Link>{' '}
          {t('auth.legalConsent.and')}{' '}
          <Link
            href={PRIVACY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-blue hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('auth.legalConsent.privacy')}
          </Link>
          {t('auth.legalConsent.suffix')}
        </span>
      }
    />
  );
}
