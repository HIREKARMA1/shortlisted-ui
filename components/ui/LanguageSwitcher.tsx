'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Languages, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { LOCALE_OPTIONS, Locale } from '@/lib/i18n/types';

type LanguageSwitcherProps = {
  /** Use inside mobile nav drawer - expands inline instead of absolute flyout */
  variant?: 'default' | 'menu';
};

/** Matches lakshya-ui/components/landing/LanguageSwitcher.tsx */
export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isMenu = variant === 'menu';

  const active = LOCALE_OPTIONS.find((l) => l.code === locale) ?? LOCALE_OPTIONS[0];

  useEffect(() => {
    if (!open || isMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, isMenu]);

  const change = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  const panelHeader = (
    <div className="flex items-start justify-between px-5 pb-3 pt-4">
      <div>
        <h3 className="text-base font-extrabold text-ink">{t('common.languageSwitcher.title')}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{t('common.languageSwitcher.subtitle')}</p>
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label={t('common.languageSwitcher.close')}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e94e3a] text-white hover:bg-[#d63b27]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  const panelList = (
    <ul role="listbox" className="max-h-[60vh] overflow-y-auto pb-2">
      {LOCALE_OPTIONS.map((l) => {
        const isActive = locale === l.code;
        return (
          <li key={l.code}>
            <button
              type="button"
              onClick={() => change(l.code)}
              className={`flex w-full items-center justify-between px-5 py-2.5 text-left transition ${
                isActive ? 'bg-[#eaf2ff]' : 'hover:bg-soft'
              }`}
            >
              <span>
                <span className={`block text-sm font-semibold ${isActive ? 'text-primary' : 'text-ink'}`}>
                  {l.label}
                </span>
                <span className="block text-xs text-muted-foreground">{l.native}</span>
              </span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={isMenu ? 'w-full' : 'relative'} ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink hover:border-primary/40 hover:bg-soft ${
          isMenu ? 'w-full justify-center' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Languages className="h-4 w-4 text-ink/70" />
        {active.native}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && isMenu && (
        <div
          role="dialog"
          aria-label={t('common.languageSwitcher.ariaSelect')}
          className="mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-line"
        >
          {panelHeader}
          {panelList}
        </div>
      )}

      {open && !isMenu && (
        <div
          role="dialog"
          aria-label={t('common.languageSwitcher.ariaSelect')}
          className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-line"
        >
          {panelHeader}
          {panelList}
        </div>
      )}
    </div>
  );
}
