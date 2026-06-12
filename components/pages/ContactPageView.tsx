'use client';

import { Clock, Mail, MapPin, MessageCircle, Phone, Shield } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { config } from '@/lib/config';
import { SiteHeader } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { MarketingPageHeader } from '@/components/layout/MarketingPageHeader';

function readList(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

const cardCls = 'rounded-2xl border border-line-default bg-white p-5 shadow-sm sm:p-6';

export function ContactPageView() {
  const { t, tRaw } = useTranslation();
  const channels = readList(tRaw('pages.contact.channels'));

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <MarketingPageHeader
        eyebrow={t('pages.contact.eyebrow')}
        title={t('pages.contact.title')}
        subtitle={t('pages.contact.subtitle')}
      />

      <section className="bg-soft">
        <div className="page-container py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="space-y-6 lg:col-span-7">
              <section className={cardCls}>
                <h2 className="font-display text-xl font-bold text-ink-primary">{t('pages.contact.reachTitle')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t('pages.contact.reachBody')}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {config.contact.phone ? (
                    <a
                      href={`tel:${config.contact.phone}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-orange px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:min-w-[180px]"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {t('pages.contact.call')}
                    </a>
                  ) : null}
                  {config.contact.whatsapp ? (
                    <a
                      href={`https://wa.me/${config.contact.whatsapp}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 sm:min-w-[180px]"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      {t('pages.contact.whatsapp')}
                    </a>
                  ) : null}
                  {config.contact.email ? (
                    <a
                      href={`mailto:${config.contact.email}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line-default bg-white px-4 py-3 text-sm font-semibold text-ink-primary transition hover:bg-soft sm:min-w-[180px]"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {t('pages.contact.emailCta')}
                    </a>
                  ) : null}
                </div>
                {config.contact.email ? (
                  <p className="mt-4 text-sm text-ink-muted">
                    {t('pages.contact.emailLabel')}:{' '}
                    <a href={`mailto:${config.contact.email}`} className="font-semibold text-brand-blue hover:underline">
                      {config.contact.email}
                    </a>
                  </p>
                ) : null}
              </section>

              <section className={cardCls}>
                <h2 className="font-display text-xl font-bold text-ink-primary">{t('pages.contact.helpTitle')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t('pages.contact.helpBody')}</p>
                {channels.length > 0 ? (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {channels.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 rounded-xl border border-line-default/80 bg-soft px-4 py-3 text-sm text-ink-secondary"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </div>

            <aside className="space-y-6 lg:col-span-5">
              <section className={cardCls}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h2 className="font-display text-lg font-bold text-ink-primary">{t('pages.contact.officeTitle')}</h2>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{t('pages.contact.address')}</p>
              </section>

              <section className={cardCls}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-soft text-ink-primary">
                    <Clock className="h-4 w-4" />
                  </span>
                  <h2 className="font-display text-lg font-bold text-ink-primary">{t('pages.contact.hoursTitle')}</h2>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{t('pages.contact.hoursBody')}</p>
              </section>

              <section className={cardCls}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-green/10 text-brand-green">
                    <Shield className="h-4 w-4" />
                  </span>
                  <h2 className="font-display text-lg font-bold text-ink-primary">{t('pages.contact.safetyTitle')}</h2>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{t('pages.contact.safetyBody')}</p>
              </section>
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
