'use client';

import { useCallback, useEffect, useState } from 'react';
import { profileService, type StudentProfile } from '@/lib/services/profileService';

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshProfile = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const userType = typeof window !== 'undefined' ? localStorage.getItem('user_type') : null;
    if (!token || userType !== 'student') {
      setIsAuthenticated(false);
      setProfile(null);
      setLoading(false);
      setError('Please sign in to use Resume Builder');
      return;
    }
    setIsAuthenticated(true);
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  return { profile, loading, error, isAuthenticated, refreshProfile };
}
