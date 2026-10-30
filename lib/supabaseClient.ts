import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const { url, publishableKey } = config.supabase;
  if (!url || !publishableKey) {
    throw new Error('Google sign-in is not configured.');
  }
  browserClient = createBrowserClient(url, publishableKey);
  return browserClient;
}

export function isSafeAuthRedirectPath(path: string | null | undefined): path is string {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) return false;
  return true;
}

export function getSupabaseAuthCallbackUrl(redirectPath?: string | null): string {
  const base = config.app.url.replace(/\/$/, '');
  const params = new URLSearchParams({ type: 'student' });
  if (isSafeAuthRedirectPath(redirectPath)) params.set('redirect', redirectPath);
  return `${base}/auth/callback?${params.toString()}`;
}
