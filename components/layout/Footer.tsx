'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { BrandLogo } from './Shell';
import { BrandStripe } from '@/components/ui/BrandStripe';

export function SiteFooter() {
  const { t } = useTranslation();

  const programLinks = [
    { href: '/about', label: t('common.nav.about') },
    { href: '/contact', label: t('common.nav.contact') },
    { href: '/#pricing', label: t('landing.footer.links.pricing') },
  ];

  const accountLinks = [
    { href: '/auth/register', label: t('common.nav.register') },
    { href: '/auth/login', label: t('common.nav.login') },
  ];

  return (
    <footer className="bg-white">
      <BrandStripe />
      <div className="page-container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandLogo />
            <p className="mt-4 max-w-sm text-sm text-ink-muted">{t('common.brand.tagline')}</p>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-ink-muted">{t('landing.footer.poweredBy')}</p>
          </div>

          <FooterCol title={t('landing.footer.program')} items={programLinks} />
          <FooterCol title={t('landing.footer.account')} items={accountLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line-default pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t('common.brand.name')}. {t('landing.footer.rights')}
          </span>
          <span>{t('landing.footer.madeFor')}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div className="md:col-span-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-primary">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            {item.href.startsWith('#') ? (
              <a href={item.href} className="text-sm text-ink-muted transition hover:text-brand-blue">
                {item.label}
              </a>
            ) : (
              <Link href={item.href} className="text-sm text-ink-muted transition hover:text-brand-blue">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
