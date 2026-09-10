import { getLoginPathForRole } from '@/lib/auth/login-routes';

const SESSION_KEYS = [
  'access_token',
  'refresh_token',
  'user_type',
  'user_name',
  'access_status',
] as const;

const LOGOUT_FLASH_KEY = 'auth_logout_flash';

export function clearSession() {
  if (typeof window === 'undefined') return;
  for (const key of SESSION_KEYS) {
    localStorage.removeItem(key);
  }
}

/** Persist a one-shot flag so the login page can show a success toast after hard redirect. */
export function markLogoutFlash() {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(LOGOUT_FLASH_KEY, '1');
}

export function consumeLogoutFlash(): boolean {
  if (typeof window === 'undefined') return false;
  if (sessionStorage.getItem(LOGOUT_FLASH_KEY) !== '1') return false;
  sessionStorage.removeItem(LOGOUT_FLASH_KEY);
  return true;
}

/**
 * Clear auth storage and hard-navigate to the role login page.
 * Uses location.replace so protected routes are not left in history (back button).
 */
export function logoutToLogin(options?: { flashSuccess?: boolean }) {
  if (typeof window === 'undefined') return;
  const loginPath = getLoginPathForRole(localStorage.getItem('user_type'));
  if (options?.flashSuccess) markLogoutFlash();
  clearSession();
  window.location.replace(loginPath);
}

/** Full-page redirect so stale React routes cannot bounce the user back. */
export function forceLogoutToLogin() {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.startsWith('/auth/login')) {
    clearSession();
    return;
  }
  logoutToLogin();
}
