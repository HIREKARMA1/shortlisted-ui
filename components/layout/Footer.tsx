'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { BrandLogo } from './Shell';

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-line-default bg-white">
      <div className="page-container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandLogo />
            <p className="mt-3 max-w-sm text-sm text-ink-muted">{t('common.brand.tagline')}</p>
            <p className="mt-4 text-xs text-ink-muted">{t('landing.footer.poweredBy')}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-primary">{t('landing.footer.program')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <a href="#how-it-works" className="hover:text-brand-blue">
                  {t('landing.footer.links.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-blue">
                  {t('landing.footer.links.features')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-brand-blue">
                  {t('landing.footer.links.pricing')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-primary">{t('landing.footer.account')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/auth/register" className="hover:text-brand-blue">
                  {t('common.nav.register')}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-brand-blue">
                  {t('common.nav.login')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line-default pt-6 text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} {t('common.brand.name')}. {t('landing.footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
