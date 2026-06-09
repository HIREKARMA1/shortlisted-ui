import { ContentNamespace, ContentTree, Locale } from './types';

import enCommon from '@/content/en/common.json';
import enLanding from '@/content/en/landing.json';
import enAuth from '@/content/en/auth.json';
import enSubscribe from '@/content/en/subscribe.json';
import enDashboard from '@/content/en/dashboard.json';

import hiCommon from '@/content/hi/common.json';
import hiLanding from '@/content/hi/landing.json';
import hiAuth from '@/content/hi/auth.json';
import hiSubscribe from '@/content/hi/subscribe.json';
import hiDashboard from '@/content/hi/dashboard.json';

import orCommon from '@/content/or/common.json';
import orLanding from '@/content/or/landing.json';
import orAuth from '@/content/or/auth.json';
import orSubscribe from '@/content/or/subscribe.json';
import orDashboard from '@/content/or/dashboard.json';

const bundles: Record<Locale, Record<ContentNamespace, ContentTree>> = {
  en: {
    common: enCommon,
    landing: enLanding,
    auth: enAuth,
    subscribe: enSubscribe,
    dashboard: enDashboard,
  },
  hi: {
    common: hiCommon,
    landing: hiLanding,
    auth: hiAuth,
    subscribe: hiSubscribe,
    dashboard: hiDashboard,
  },
  or: {
    common: orCommon,
    landing: orLanding,
    auth: orAuth,
    subscribe: orSubscribe,
    dashboard: orDashboard,
  },
};

export function getNamespace(locale: Locale, namespace: ContentNamespace): ContentTree {
  return bundles[locale][namespace];
}

export function getMergedContent(locale: Locale): ContentTree {
  return {
    common: bundles[locale].common,
    landing: bundles[locale].landing,
    auth: bundles[locale].auth,
    subscribe: bundles[locale].subscribe,
    dashboard: bundles[locale].dashboard,
  };
}
