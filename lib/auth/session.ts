import { UserType } from '@/lib/api';

export type Session = {
  accessToken: string;
  userType: UserType;
  userName: string;
  accessStatus: string;
};

export function readSession(): Session | null {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) return null;

  return {
    accessToken,
    userType: (localStorage.getItem('user_type') as UserType) || 'student',
    userName: localStorage.getItem('user_name') || '',
    accessStatus: localStorage.getItem('access_status') || '',
  };
}

export function getPostLoginPath(session: Session): string {
  if (session.userType === 'super_admin') return '/dashboard/super-admin';
  if (session.userType === 'admin') return '/dashboard/admin';
  if (session.accessStatus === 'active') return '/dashboard/student';
  return '/subscribe';
}
