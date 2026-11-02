import { getSupabaseAuthCallbackUrl, getSupabaseBrowserClient } from '@/lib/supabaseClient';

export async function startStudentGoogleAuth(redirectPath?: string | null): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getSupabaseAuthCallbackUrl(redirectPath),
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });
  if (error) throw error;
}
