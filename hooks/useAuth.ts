'use client';

import { useRouter } from 'next/navigation';
import { api, TokenResponse, UserType } from '@/lib/api';

export function useAuth() {
  const router = useRouter();

  const saveSession = (data: TokenResponse) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user_type', data.user_type);
    localStorage.setItem('user_name', data.name);
    localStorage.setItem('access_status', data.access_status || '');
  };

  const logout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  const login = async (email: string, password: string, user_type: UserType) => {
    const data = await api.login(email, password, user_type);
    saveSession(data);
    if (data.user_type === 'student') {
      if (data.access_status === 'active') router.push('/dashboard/student');
      else router.push('/subscribe');
    } else if (data.user_type === 'super_admin') {
      router.push('/dashboard/super-admin');
    } else {
      router.push('/dashboard/admin');
    }
  };

  const getUserType = (): UserType | null => {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem('user_type') as UserType) || null;
  };

  return { login, logout, saveSession, getUserType };
}
