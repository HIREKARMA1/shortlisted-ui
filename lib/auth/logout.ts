import { getLoginPathForRole } from '@/lib/auth/login-routes';

const SESSION_KEYS = [
  'access_token',
  'refresh_token',
  'user_type',
  'user_name',
  'access_status',
] as const;

export function clearSession() {
  if (typeof window === 'undefined') return;
  for (const key of SESSION_KEYS) {
    localStorage.removeItem(key);
  }
}

/** Full-page redirect so stale React routes cannot bounce the user back. */
export function forceLogoutToLogin() {
  if (typeof window === 'undefined') return;
  const loginPath = getLoginPathForRole(localStorage.getItem('user_type'));
  clearSession();
  if (!window.location.pathname.startsWith('/auth/login')) {
    window.location.replace(loginPath);
  }
}
