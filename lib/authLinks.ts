import { getLoginPathForRole } from '@/lib/auth/login-routes';

/** Compatibility helper for Disha Resume Builder auth redirects. */
export function buildAuthPath(path: string): string {
  if (path.includes('register')) return '/auth/register';
  if (path.includes('login')) return getLoginPathForRole('student');
  return path.startsWith('/') ? path : `/${path}`;
}
