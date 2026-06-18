export type Locale = 'en' | 'hi' | 'or';

export const LOCALES: Locale[] = ['en', 'hi', 'or'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  or: 'ଓଡ଼ିଆ',
};

export type ContentNamespace =
  | 'common'
  | 'landing'
  | 'auth'
  | 'subscribe'
  | 'dashboard'
  | 'pages';

export const LOCALE_OPTIONS = [
  { code: 'en' as Locale, label: 'English', native: 'ENGLISH' },
  { code: 'hi' as Locale, label: 'Hindi', native: 'हिन्दी' },
  { code: 'or' as Locale, label: 'Odia', native: 'ଓଡ଼ିଆ' },
];

export type ContentTree = Record<string, unknown>;
