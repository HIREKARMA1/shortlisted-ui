import type { UserType } from '@/lib/api';

/** Login path for a role. Internal roles use dedicated routes not linked from public UI. */
export function getLoginPathForRole(role?: UserType | string | null): string {
  if (role === 'super_admin') return '/auth/login/internal';
  if (role === 'admin') return '/auth/login/coordinator';
  return '/auth/login';
}
