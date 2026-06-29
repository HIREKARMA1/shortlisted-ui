'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { profileService, type StudentProfile } from '@/lib/services/profileService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';

function isProfileComplete(profile: StudentProfile): boolean {
  return Boolean(
    profile.name?.trim() &&
      profile.email?.trim() &&
      profile.phone?.trim() &&
      profile.resume
  );
}

export function StudentProfileView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard('student');

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setName(profileData.name ?? '');
      setPhone(profileData.phone ?? '');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to load profile';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const validate = (currentProfile: StudentProfile | null): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = t('dashboard.profile.nameRequired');
    }
    if (!phone.trim()) {
      nextErrors.phone = t('dashboard.profile.phoneRequired');
    } else if (!/^\d{10}$/.test(phone.trim())) {
      nextErrors.phone = t('dashboard.profile.phoneInvalid');
    }
    if (!currentProfile?.resume) {
      nextErrors.resume = t('dashboard.profile.resumeRequired');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(profile)) {
      toast.error(t('dashboard.profile.saveError'));
      return;
    }

    setSaving(true);
    try {
      const updated = await profileService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });
      setProfile(updated);
      toast.success(t('dashboard.profile.saveSuccess'));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('dashboard.profile.saveFailed');
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setUploadingResume(true);
    try {
      await profileService.uploadResume(file);
      await loadProfile();
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
      toast.success(t('dashboard.profile.resumeSuccess'));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('dashboard.profile.resumeFailed');
      toast.error(String(msg));
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student" title={t('dashboard.profile.title')} onLogout={logout}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error && !profile) {
    return (
      <DashboardLayout role="student" title={t('dashboard.profile.title')} onLogout={logout}>
        <div className="w-full rounded-xl border border-line-default bg-white p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-brand-red" />
          <p className="mb-4 text-ink-secondary">{error}</p>
          <Button onClick={loadProfile}>{t('dashboard.profile.tryAgain')}</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  const complete = isProfileComplete(profile);

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.profile.title')}
      subtitle={t('dashboard.profile.subtitle')}
      onLogout={logout}
    >
      <div className="w-full space-y-6">
        {!complete && (
          <div className="rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-4 py-3 text-sm text-ink-secondary">
            {t('dashboard.profile.incompleteHint')}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="w-full rounded-xl border border-line-default bg-white p-6 shadow-card md:p-8"
        >
          <h2 className="text-lg font-semibold text-ink-primary">{t('dashboard.profile.heading')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t('dashboard.profile.headingHint')}</p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Input
              label={`${t('dashboard.profile.name')} *`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={errors.name}
            />

            <Input
              label={`${t('dashboard.profile.email')} *`}
              value={profile.email}
              readOnly
              disabled
            />

            <Input
              label={`${t('dashboard.profile.contact')} *`}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              maxLength={10}
              required
              error={errors.phone}
            />

            <div className="md:col-span-2 xl:col-span-3">
              <p className="mb-2 text-sm font-medium text-ink-secondary">
                {t('dashboard.profile.resume')} *
              </p>
              <p className="mb-2 text-xs text-ink-muted">{t('dashboard.profile.resumeHint')}</p>
              <FileUpload
                type="document"
                currentFile={profile.resume}
                onFileSelect={handleResumeUpload}
                disabled={uploadingResume}
                placeholder={t('dashboard.profile.resumePlaceholder')}
              />
              {errors.resume && <p className="mt-2 text-xs text-brand-red">{errors.resume}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-line-default pt-6">
            <Button type="submit" variant="accent" disabled={saving || uploadingResume}>
              {saving ? t('dashboard.profile.saving') : t('dashboard.profile.save')}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
