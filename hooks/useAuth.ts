'use client';

import { useRouter } from 'next/navigation';
import { getPostLoginPath } from '@/lib/auth/session';
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
    router.push(
      getPostLoginPath({
        accessToken: data.access_token,
        userType: data.user_type,
        userName: data.name,
        accessStatus: data.access_status || '',
      }),
    );
  };

  const getUserType = (): UserType | null => {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem('user_type') as UserType) || null;
  };

  return { login, logout, saveSession, getUserType };
}
