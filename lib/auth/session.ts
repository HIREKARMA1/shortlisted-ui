import { UserType } from '@/lib/api';

export type Session = {
  accessToken: string;
  userType: UserType;
  userName: string;
  accessStatus: string;
  signupChannel: string;
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
    signupChannel: localStorage.getItem('signup_channel') || 'web',
  };
}

export function getLockedStudentPath(session: Pick<Session, 'signupChannel'>): string {
  return session.signupChannel === 'whatsapp' ? '/subscribe/review' : '/subscribe';
}

export function getInactiveStudentPath(): string {
  return '/dashboard/student/inactive';
}

export function getStudentHomePath(session: Pick<Session, 'accessStatus' | 'signupChannel'>): string {
  if (session.accessStatus === 'inactive') return getInactiveStudentPath();
  if (session.accessStatus !== 'active' && session.signupChannel === 'whatsapp') {
    return '/subscribe/review';
  }
  return '/dashboard/student';
}

export function getPostLoginPath(session: Session): string {
  if (session.userType === 'super_admin') return '/dashboard/super-admin';
  if (session.userType === 'admin') return '/dashboard/admin';
  if (session.userType === 'student') return getStudentHomePath(session);
  if (session.accessStatus === 'inactive') return getInactiveStudentPath();
  if (session.accessStatus === 'active') return '/dashboard/student';
  return getLockedStudentPath(session);
}

export function getSafeRedirectPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;

  try {
    const url = new URL(value, 'http://localhost');
    return url.origin === 'http://localhost' ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}
