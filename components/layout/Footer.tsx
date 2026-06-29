'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { PRIVACY_URL, REFUND_URL, TERMS_URL } from '@/lib/legal-links';
import { BrandLogo } from './Shell';
import { BrandStripe } from '@/components/ui/BrandStripe';

const LEGAL_LINKS = [
  { href: TERMS_URL, labelKey: 'landing.footer.legal.terms' },
  { href: PRIVACY_URL, labelKey: 'landing.footer.legal.privacy' },
  { href: REFUND_URL, labelKey: 'landing.footer.legal.refund' },
] as const;

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/hirekarma', label: 'Twitter', icon: Twitter },
  { href: 'https://www.linkedin.com/company/hirekarma-pvt-ltd', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://facebook.com/hirekarma', label: 'Facebook', icon: Facebook },
  { href: 'https://instagram.com/hirekarma', label: 'Instagram', icon: Instagram },
] as const;

type SiteInfo = {
  office_address?: string;
  contact_email?: string;
  contact_phone?: string;
};

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);

  useEffect(() => {
    api
      .getSiteInfo()
      .then(setSiteInfo)
      .catch(() => setSiteInfo(null));
  }, []);

  const officeAddress = t('landing.footer.officeAddress');
  const contactEmail = siteInfo?.contact_email ?? t('landing.footer.contactEmail');
  const contactPhone = siteInfo?.contact_phone ?? t('landing.footer.contactPhone');

  return (
    <footer className="bg-white">
      <BrandStripe />
      <div className="page-container py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start lg:gap-12">
          <div className="max-w-md">
            <BrandLogo />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              {t('landing.footer.description')}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              {t('landing.footer.poweredBy')}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line-default bg-white text-ink-muted transition hover:border-brand-blue hover:text-brand-blue"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-primary">
              {t('landing.footer.contactTitle')}
            </h3>

            <p>
              <span className="font-medium text-ink-secondary">{t('landing.footer.officeLabel')}:</span>{' '}
              {officeAddress}
            </p>

            {contactEmail && (
              <p>
                <span className="font-medium text-ink-secondary">{t('landing.footer.emailLabel')}:</span>{' '}
                <a href={`mailto:${contactEmail}`} className="transition hover:text-brand-blue">
                  {contactEmail}
                </a>
              </p>
            )}

            {contactPhone && (
              <p>
                <span className="font-medium text-ink-secondary">{t('landing.footer.contactLabel')}:</span>{' '}
                <a
                  href={`tel:${contactPhone.replace(/\s/g, '')}`}
                  className="transition hover:text-brand-blue"
                >
                  {contactPhone}
                </a>
              </p>
            )}
          </div>

          <nav aria-label="Legal">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-primary">
              {t('landing.footer.policyTitle')}
            </h3>
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3 lg:flex-col">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-base font-medium text-ink-secondary transition hover:text-brand-blue sm:text-[1.05rem]"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line-default pt-6 text-sm text-ink-muted sm:text-base">
          <span>
            © {year}{' '}
            <a
              href="https://hirekarma.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink-secondary transition hover:text-brand-blue"
            >
              {t('landing.footer.companyName')}
            </a>
            . {t('landing.footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  );
}
