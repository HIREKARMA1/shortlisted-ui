'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
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

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <BrandStripe />
      <div className="page-container py-12 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <BrandLogo />
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-[1.05rem]">
              {t('common.brand.tagline')}
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

          <nav aria-label="Legal" className="lg:pt-2">
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
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
