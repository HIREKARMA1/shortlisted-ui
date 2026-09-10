'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin, type LucideProps } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { PRIVACY_URL, REFUND_URL, TERMS_URL } from '@/lib/legal-links';
import { BrandLogo } from './Shell';
import { BrandStripe } from '@/components/ui/BrandStripe';

const OFFICE_MAPS_URL =
  'https://www.google.com/maps/place/HireKarma+Private+Limited/@20.383776281109,85.82036437501301,17z/data=!3m1!4b1!4m6!3m5!1s0x3a19096e0259fc7f:0x7ad66a4df8112eda!8m2!3d20.3837763!4d85.8229393!16s%2Fg%2F11s';

const OFFICE_MAPS_EMBED_URL =
  'https://www.google.com/maps?q=HireKarma+Private+Limited,+Raghunathpur,+Bhubaneswar&hl=en&z=16&output=embed';

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
      <div className="page-container py-8 sm:py-9">
        <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12 xl:gap-x-16">
          {/* Column 1 — Company */}
          <div className="min-w-0">
            <BrandLogo className="flex min-h-[1.75rem] items-center sm:min-h-8" />
            <p className="mt-2.5 text-sm leading-relaxed text-ink-muted sm:text-base">
              {t('landing.footer.tagline')}
            </p>
            <div className="mt-4 flex items-center gap-3">
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

          {/* Column 2 — Policy */}
          <nav aria-label="Legal" className="min-w-0">
            <h3 className="mb-2.5 flex min-h-[1.75rem] items-center text-sm font-semibold uppercase tracking-wide text-ink-primary sm:min-h-8">
              {t('landing.footer.policyTitle')}
            </h3>
            <ul className="flex flex-col gap-2 text-sm leading-relaxed sm:text-base">
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

          {/* Column 3 — Contact Us */}
          <div className="min-w-0 text-sm leading-relaxed text-ink-muted sm:text-base">
            <h3 className="mb-2.5 flex min-h-[1.75rem] items-center text-sm font-semibold uppercase tracking-wide text-ink-primary sm:min-h-8">
              {t('landing.footer.contactTitle')}
            </h3>
            <div className="flex flex-col gap-2">
              {contactEmail && (
                <p className="grid grid-cols-[4.75rem_1fr] items-start gap-x-2">
                  <span className="font-medium text-ink-secondary">{t('landing.footer.emailLabel')}:</span>
                  <a href={`mailto:${contactEmail}`} className="break-words transition hover:text-brand-blue">
                    {contactEmail}
                  </a>
                </p>
              )}

              {contactPhone && (
                <p className="grid grid-cols-[4.75rem_1fr] items-start gap-x-2">
                  <span className="font-medium text-ink-secondary">{t('landing.footer.contactLabel')}:</span>
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    className="transition hover:text-brand-blue"
                  >
                    {contactPhone}
                  </a>
                </p>
              )}

              <p className="grid grid-cols-[4.75rem_1fr] items-start gap-x-2">
                <span className="font-medium text-ink-secondary">{t('landing.footer.locationLabel')}:</span>
                <span className="break-words">{officeAddress}</span>
              </p>
            </div>
          </div>

          {/* Column 4 — Map */}
          <div className="min-w-0">
            <div
              className="mb-2.5 hidden min-h-[1.75rem] sm:block sm:min-h-8"
              aria-hidden="true"
            />
            <div className="w-full max-w-[240px] overflow-hidden rounded-lg border border-line-default bg-white sm:max-w-[260px]">
              <iframe
                title={t('landing.footer.mapTitle')}
                src={OFFICE_MAPS_EMBED_URL}
                className="h-36 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={OFFICE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border-t border-line-default px-3 py-2 text-xs font-medium text-ink-secondary transition hover:bg-surface-muted hover:text-brand-blue sm:text-sm"
              >
                {t('landing.footer.openInMaps')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-line-default pt-4 text-sm text-ink-muted sm:text-base">
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
