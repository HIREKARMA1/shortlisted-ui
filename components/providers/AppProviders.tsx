'use client';

import { I18nProvider } from '@/lib/i18n/context';
import { themeToCssVariables } from '@/theme';
import { WhatsAppFab } from '@/components/ui/WhatsAppFab';
import { Toaster } from 'react-hot-toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const cssVars = themeToCssVariables();

  return (
    <I18nProvider>
      <div style={cssVars as React.CSSProperties}>{children}</div>
      <WhatsAppFab />
      <Toaster position="top-right" />
    </I18nProvider>
  );
}
