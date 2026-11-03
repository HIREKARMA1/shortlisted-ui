import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export function createSupabaseRouteClient(handlers: {
  getAll: () => { name: string; value: string }[];
  setAll: (cookiesToSet: CookieToSet[]) => void;
}): SupabaseClient {
  const { url, publishableKey } = config.supabase;
  if (!url || !publishableKey) {
    throw new Error('Google sign-in is not configured.');
  }
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: handlers.getAll,
      setAll: handlers.setAll,
    },
  });
}
