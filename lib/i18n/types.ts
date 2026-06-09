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
  | 'dashboard';

export type ContentTree = Record<string, unknown>;
