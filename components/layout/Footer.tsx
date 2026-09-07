'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin, MapPin, type LucideProps } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { PRIVACY_URL, REFUND_URL, TERMS_URL } from '@/lib/legal-links';
import { BrandLogo } from './Shell';
import { BrandStripe } from '@/components/ui/BrandStripe';

const OFFICE_MAPS_URL =
  'https://www.google.com/maps/place/HireKarma+Private+Limited/@20.383776281109,85.82036437501301,17z/data=!3m1!4b1!4m6!3m5!1s0x3a19096e0259fc7f:0x7ad66a4df8112eda!8m2!3d20.3837763!4d85.8229393!16s%2Fg%2F11s';

function XLogo({ className, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.227-8.451L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const LEGAL_LINKS = [
  { href: TERMS_URL, labelKey: 'landing.footer.legal.terms' },
  { href: PRIVACY_URL, labelKey: 'landing.footer.legal.privacy' },
  { href: REFUND_URL, labelKey: 'landing.footer.legal.refund' },
] as const;

const SOCIAL_LINKS = [
  { href: 'https://x.com/hirekarma', label: 'X', icon: XLogo },
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
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-md lg:max-w-sm xl:max-w-md">
            <BrandLogo className="min-h-[1.75rem] sm:min-h-8" />
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

          <nav aria-label="Legal" className="shrink-0">
            <h3 className="mb-4 flex min-h-[1.75rem] items-center text-sm font-semibold uppercase tracking-wide text-ink-primary sm:min-h-8">
              {t('landing.footer.policyTitle')}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm leading-relaxed sm:text-base">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-medium text-ink-secondary transition hover:text-brand-blue"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-xs shrink-0 space-y-2.5 text-sm leading-relaxed text-ink-muted sm:text-base">
            <h3 className="mb-4 flex min-h-[1.75rem] items-center text-sm font-semibold uppercase tracking-wide text-ink-primary sm:min-h-8">
              {t('landing.footer.contactTitle')}
            </h3>

            {contactEmail && (
              <p className="grid grid-cols-[5.5rem_1fr] items-start gap-x-2">
                <span className="font-medium text-ink-secondary">{t('landing.footer.emailLabel')}:</span>
                <a href={`mailto:${contactEmail}`} className="transition hover:text-brand-blue">
                  {contactEmail}
                </a>
              </p>
            )}

            {contactPhone && (
              <p className="grid grid-cols-[5.5rem_1fr] items-start gap-x-2">
                <span className="font-medium text-ink-secondary">{t('landing.footer.contactLabel')}:</span>
                <a
                  href={`tel:${contactPhone.replace(/\s/g, '')}`}
                  className="transition hover:text-brand-blue"
                >
                  {contactPhone}
                </a>
              </p>
            )}

            <p className="grid grid-cols-[5.5rem_1fr] items-start gap-x-2">
              <a
                href={OFFICE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View office location on Google Maps"
                className="mt-0.5 w-fit text-ink-secondary transition hover:text-brand-blue"
              >
                <MapPin className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
              </a>
              <span>{officeAddress}</span>
            </p>
          </div>
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
