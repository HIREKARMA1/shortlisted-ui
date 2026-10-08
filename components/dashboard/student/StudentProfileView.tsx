'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { profileService, type StudentProfile } from '@/lib/services/profileService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { getPersonNameError, normalizePersonName } from '@/lib/validation/personName';
import { ProfilePhotoDisplay } from '@/components/dashboard/student/ProfilePhotoDisplay';
import { ProfilePhotoChangeModal } from '@/components/dashboard/student/ProfilePhotoChangeModal';

function isProfileComplete(profile: StudentProfile): boolean {
  return Boolean(
    profile.name?.trim() &&
      profile.email?.trim() &&
      profile.phone?.trim() &&
      profile.resume
  );
}

function ProfileField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="mt-1 text-sm text-ink-primary">{value || '—'}</dd>
    </div>
  );
}

export function StudentProfileView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard('student');
  useStudentActiveGate();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nameTouched, setNameTouched] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null);

  const clearPendingPhoto = useCallback(() => {
    setPendingPhotoFile(null);
    setPendingPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const syncDraftFromProfile = useCallback(
    (profileData: StudentProfile) => {
      setName(profileData.name ?? '');
      setPhone(profileData.phone ?? '');
      clearPendingPhoto();
      setErrors({});
      setNameTouched(false);
    },
    [clearPendingPhoto]
  );

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      syncDraftFromProfile(profileData);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to load profile';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }, [syncDraftFromProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => () => clearPendingPhoto(), [clearPendingPhoto]);

  useEffect(() => {
    if (loading || typeof window === 'undefined') return;
    if (window.location.hash !== '#resume') return;
    const el = document.getElementById('resume-upload');
    if (!el) return;
    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-brand-blue', 'ring-offset-2');
      window.setTimeout(() => {
        el.classList.remove('ring-2', 'ring-brand-blue', 'ring-offset-2');
      }, 2500);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [loading, profile]);

  const validate = (currentProfile: StudentProfile | null): boolean => {
    const nextErrors: Record<string, string> = {};
    const nameErr = getPersonNameError(name, {
      required: true,
      invalidMessage: t('dashboard.profile.nameInvalid'),
    });
    if (nameErr) {
      nextErrors.name = nameErr;
    }
    setNameTouched(true);
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

  const handleEnterEdit = () => {
    if (profile) syncDraftFromProfile(profile);
    setMode('edit');
  };

  const handleCancelEdit = () => {
    if (profile) syncDraftFromProfile(profile);
    setMode('view');
  };

  const handlePendingPhoto = (file: File) => {
    clearPendingPhoto();
    setPendingPhotoFile(file);
    setPendingPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(profile)) {
      toast.error(t('dashboard.profile.saveError'));
      return;
    }

    setSaving(true);
    try {
      if (pendingPhotoFile) {
        await profileService.uploadProfilePicture(pendingPhotoFile);
      }
      const updated = await profileService.updateProfile({
        name: normalizePersonName(name),
        phone: phone.trim(),
      });
      setProfile(updated);
      syncDraftFromProfile(updated);
      setMode('view');
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
  const isEditing = mode === 'edit';
  const displayPhotoUrl = pendingPhotoPreview ?? profile.profile_picture ?? null;
  const resumeLabel = profile.resume
    ? t('dashboard.profile.resumeUploaded')
    : t('dashboard.profile.resumeMissing');

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

        <div className="w-full rounded-xl border border-line-default bg-white p-6 shadow-card md:p-8">
          <div className="flex flex-col items-center border-b border-line-default pb-6 text-center">
            <ProfilePhotoDisplay photoUrl={displayPhotoUrl} name={profile.name} size="lg" />
            {isEditing ? (
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={() => setPhotoModalOpen(true)}
              >
                {t('dashboard.profile.photo.change')}
              </Button>
            ) : (
              <Button type="button" variant="accent" className="mt-4" onClick={handleEnterEdit}>
                {t('dashboard.profile.edit')}
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="mt-6" noValidate>
              <h2 className="text-lg font-semibold text-ink-primary">{t('dashboard.profile.heading')}</h2>
              <p className="mt-1 text-sm text-ink-muted">{t('dashboard.profile.headingHint')}</p>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <Input
                  label={`${t('dashboard.profile.name')} *`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameTouched) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        const err = getPersonNameError(e.target.value, {
                          required: true,
                          invalidMessage: t('dashboard.profile.nameInvalid'),
                        });
                        if (err) next.name = err;
                        else delete next.name;
                        return next;
                      });
                    }
                  }}
                  onBlur={() => {
                    setNameTouched(true);
                    const err = getPersonNameError(name, {
                      required: true,
                      invalidMessage: t('dashboard.profile.nameInvalid'),
                    });
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (err) next.name = err;
                      else delete next.name;
                      return next;
                    });
                  }}
                  required
                  error={errors.name}
                />

                <Input
                  label={`${t('dashboard.profile.email')} *`}
                  value={profile.email}
                  readOnly
                  aria-readonly="true"
                  tabIndex={-1}
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

                <div
                  id="resume-upload"
                  className="scroll-mt-24 rounded-lg transition-shadow md:col-span-2 xl:col-span-3"
                >
                  <p className="mb-2 text-sm font-medium text-ink-secondary">
                    {t('dashboard.profile.resume')} *
                  </p>
                  <p className="mb-2 text-xs text-ink-muted">{t('dashboard.profile.resumeHint')}</p>
                  <FileUpload
                    type="document"
                    currentFile={profile.resume}
                    onFileSelect={handleResumeUpload}
                    disabled={uploadingResume || saving}
                    placeholder={t('dashboard.profile.resumePlaceholder')}
                  />
                  {errors.resume && <p className="mt-2 text-xs text-brand-red">{errors.resume}</p>}
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line-default pt-6 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={handleCancelEdit} disabled={saving || uploadingResume}>
                  {t('dashboard.profile.cancel')}
                </Button>
                <Button type="submit" variant="accent" disabled={saving || uploadingResume}>
                  {saving ? t('dashboard.profile.saving') : t('dashboard.profile.save')}
                </Button>
              </div>
            </form>
          ) : (
            <dl className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <ProfileField label={`${t('dashboard.profile.name')} *`} value={profile.name ?? ''} />
              <ProfileField label={`${t('dashboard.profile.email')} *`} value={profile.email} />
              <ProfileField label={`${t('dashboard.profile.contact')} *`} value={profile.phone ?? ''} />
              <div className="md:col-span-2 xl:col-span-3">
                <ProfileField label={`${t('dashboard.profile.resume')} *`} value={resumeLabel} />
                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-brand-blue hover:underline"
                  >
                    {t('dashboard.profile.viewResume')}
                  </a>
                )}
              </div>
            </dl>
          )}
        </div>
      </div>

      <ProfilePhotoChangeModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        onPhotoSelected={handlePendingPhoto}
      />
    </DashboardLayout>
  );
}
