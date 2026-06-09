'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMergedContent } from './loader';
import { resolvePath, resolveWithParams } from './resolve';
import { ContentTree, Locale, LOCALES } from './types';

const STORAGE_KEY = 'shortlisted_locale';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  content: ContentTree;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  return stored && LOCALES.includes(stored) ? stored : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const content = useMemo(() => getMergedContent(locale), [locale]);

  const t = useCallback(
    (path: string, params?: Record<string, string | number>) => {
      const raw = resolvePath(content, path);
      return resolveWithParams(raw, params);
    },
    [content]
  );

  const value = useMemo(() => ({ locale, setLocale, t, content }), [locale, setLocale, t, content]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useTranslation() {
  const { t, locale, setLocale } = useI18n();
  return { t, locale, setLocale };
}
