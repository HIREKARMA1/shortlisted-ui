'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle, Award, Briefcase, Code2, Cpu,
  FileText, GraduationCap, Loader2, Pencil, Phone, Rocket, Target, Upload, UserRound, Mail, X,
  Video,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { profileService, type StudentProfile } from '@/lib/services/profileService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { StudentResumeSection } from '@/components/dashboard/student/StudentResumeSection';

function isProfileComplete(profile: StudentProfile): boolean {
  return Boolean(
    profile.name?.trim() &&
      profile.email?.trim() &&
      profile.phone?.trim() &&
      profile.resume
  );
}

type ProfileSectionKey = 'personal' | 'education' | 'skills' | 'experience' | 'projects' | 'certifications' | 'preferences' | 'resume';

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
  const [editing, setEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<ProfileSectionKey | null>(null);
  const [activeSection, setActiveSection] = useState<ProfileSectionKey | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState<Partial<StudentProfile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interviewCounts, setInterviewCounts] = useState<{ real: number | null; ai: number | null }>({ real: null, ai: null });
  const [resumeReloadToken, setResumeReloadToken] = useState(0);
  const heroResumeInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setName(profileData.name ?? '');
      setPhone(profileData.phone ?? '');
      setDetails(profileData);
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

  useEffect(() => {
    let cancelled = false;
    const refreshCounts = async () => {
      const [bookingsResult, assessmentsResult] = await Promise.allSettled([
        api.get<{ status?: string }[]>('/interviews/bookings'),
        api.getStudentAssessments(),
      ]);
      if (cancelled) return;
      const bookings = bookingsResult.status === 'fulfilled' && Array.isArray(bookingsResult.value)
        ? bookingsResult.value
        : null;
      const assessments = assessmentsResult.status === 'fulfilled' && Array.isArray(assessmentsResult.value)
        ? assessmentsResult.value as Record<string, unknown>[] : null;
      const real = bookings?.filter((booking) => String(booking.status || '').toLowerCase() === 'completed').length;
      const ai = assessments?.filter((assessment) => {
        const label = `${String(assessment.assessment_name || '')} ${String(assessment.instructions || '')}`;
        const isAiInterview = /\b(ai|mock)\b.{0,40}\binterview\b|\binterview\b.{0,40}\b(ai|mock)\b/i.test(label);
        return isAiInterview && Boolean(assessment.has_given || assessment.has_completed);
      }).length;
      setInterviewCounts((current) => ({
        real: real ?? current.real,
        ai: ai ?? current.ai,
      }));
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refreshCounts();
    };
    void refreshCounts();
    window.addEventListener('focus', refreshCounts);
    window.addEventListener('pageshow', refreshCounts);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    const interval = window.setInterval(refreshWhenVisible, 30_000);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', refreshCounts);
      window.removeEventListener('pageshow', refreshCounts);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.clearInterval(interval);
    };
  }, []);

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

  useEffect(() => {
    if (!editing && !activeSection) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving && !uploadingResume) {
        closeEditor();
        setActiveSection(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [editing, activeSection, saving, uploadingResume]);

  const validate = (currentProfile: StudentProfile | null): boolean => {
    const nextErrors: Record<string, string> = {};
    const validatePersonal = !editingSection || editingSection === 'personal';
    const validateResume = !editingSection || editingSection === 'resume';
    if (validatePersonal && !name.trim()) {
      nextErrors.name = t('dashboard.profile.nameRequired');
    }
    if (validatePersonal && !phone.trim()) {
      nextErrors.phone = t('dashboard.profile.phoneRequired');
    } else if (validatePersonal && !/^\d{10}$/.test(phone.trim())) {
      nextErrors.phone = t('dashboard.profile.phoneInvalid');
    }
    if (validateResume && !currentProfile?.resume) {
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
        institution: details.institution || '',
        degree: details.degree || '',
        branch: details.branch || '',
        major: details.major || '',
        graduation_year: details.graduation_year || undefined,
        technical_skills: details.technical_skills || '',
        soft_skills: details.soft_skills || '',
        internship_experience: details.internship_experience || '',
        project_details: details.project_details || '',
        certifications: details.certifications || '',
        preferred_industry: details.preferred_industry || '',
        job_roles_of_interest: details.job_roles_of_interest || '',
        location_preferences: details.location_preferences || '',
      });
      setProfile(updated);
      setDetails(updated);
      setEditing(false);
      setEditingSection(null);
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
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be less than 5MB.');
      return;
    }
    setUploadingResume(true);
    try {
      const result = await profileService.uploadResume(file);
      const url = result?.file_url || result?.resume?.file_url;
      setProfile((current) => (current ? { ...current, resume: url || current.resume } : current));
      setDetails((current) => ({ ...current, resume: url || current.resume }));
      setResumeReloadToken((value) => value + 1);
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

  const handleCurrentResumeChange = useCallback((resumeUrl: string | null) => {
    setProfile((current) => (current ? { ...current, resume: resumeUrl || undefined } : current));
    setDetails((current) => ({ ...current, resume: resumeUrl || undefined }));
    if (resumeUrl) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
    }
  }, []);

  const handlePhotoUpload = async (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Choose a JPG or PNG image.');
      return;
    }
    setUploadingPhoto(true);
    try {
      await profileService.uploadProfilePicture(file);
      await loadProfile();
      toast.success('Profile photo updated.');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Could not upload profile photo.';
      toast.error(String(msg));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updateDetail = (key: keyof StudentProfile, value: string | number | undefined) => {
    setDetails((current) => ({ ...current, [key]: value }));
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
  const skills = (profile.technical_skills || '').split(/[,\n;]/).map((item) => item.trim()).filter(Boolean);
  const certifications = (profile.certifications || '').split(/[,\n;]/).map((item) => item.trim()).filter(Boolean);
  const preferences = [profile.job_roles_of_interest, profile.preferred_industry, profile.location_preferences].filter(Boolean);
  const resumeName = profile.resume?.split(/[\\/]/).pop() || 'Resume uploaded';
  const displayResumeName = /^[a-f0-9]{24,}(\.[a-z0-9]+)?$/i.test(resumeName) ? 'Resume.pdf' : resumeName;

  const sectionContent: Record<ProfileSectionKey, { title: string; targetId: string; items: { label: string; value?: string | number | null }[]; emptyText: string }> = {
    personal: { title: 'Personal details', targetId: 'edit-personal', emptyText: 'Your contact details will appear here.', items: [
      { label: 'Name', value: profile.name }, { label: 'Email', value: profile.email }, { label: 'Contact number', value: profile.phone },
      { label: 'Location', value: [profile.city, profile.state, profile.country].filter(Boolean).join(', ') },
    ] },
    education: { title: 'Education', targetId: 'edit-education', emptyText: 'Add your degree, institution and graduation details.', items: [
      { label: 'Degree', value: profile.degree }, { label: 'Branch / specialization', value: profile.branch }, { label: 'Major', value: profile.major },
      { label: 'Institution', value: profile.institution }, { label: 'Graduation year', value: profile.graduation_year }, { label: 'CGPA', value: profile.btech_cgpa },
    ] },
    skills: { title: 'Skills', targetId: 'edit-skills', emptyText: 'Add technical or soft skills to show your strengths.', items: [
      { label: 'Technical skills', value: profile.technical_skills }, { label: 'Soft skills', value: profile.soft_skills },
    ] },
    experience: { title: 'Experience', targetId: 'edit-experience', emptyText: 'Add internships or work experience, including your role and responsibilities.', items: [
      { label: 'Experience', value: profile.internship_experience },
    ] },
    projects: { title: 'Projects', targetId: 'edit-projects', emptyText: 'Add project names, technologies and a short description.', items: [
      { label: 'Projects', value: profile.project_details },
    ] },
    certifications: { title: 'Certifications', targetId: 'edit-certifications', emptyText: 'Add certifications you have completed.', items: [
      { label: 'Certifications', value: profile.certifications },
    ] },
    preferences: { title: 'Career preferences', targetId: 'edit-preferences', emptyText: 'Add the roles, domains and locations you prefer.', items: [
      { label: 'Preferred roles', value: profile.job_roles_of_interest }, { label: 'Preferred domain', value: profile.preferred_industry }, { label: 'Preferred location', value: profile.location_preferences },
    ] },
    resume: { title: 'Resume details', targetId: 'resume-upload', emptyText: 'Upload a PDF resume to complete your profile.', items: [
      { label: 'File', value: profile.resume ? displayResumeName : '' }, { label: 'Status', value: profile.resume ? 'Uploaded' : '' },
    ] },
  };

  const openEditor = (targetId?: string, section?: ProfileSectionKey | null) => {
    setActiveSection(null);
    setEditingSection(section || null);
    setEditing(true);
    if (targetId) {
      window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 140);
    }
  };

  const closeEditor = () => {
    setEditing(false);
    setEditingSection(null);
  };

  const openSection = (section: ProfileSectionKey) => setActiveSection(section);

  const Section = ({ title, icon: Icon, children, className = '', sectionKey, interactive = true }: {
    title: string; icon: typeof UserRound; children: React.ReactNode; className?: string; sectionKey?: ProfileSectionKey; interactive?: boolean;
  }) => (
    <section
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `View ${title.toLowerCase()} details` : undefined}
      onClick={interactive && sectionKey ? () => openSection(sectionKey) : undefined}
      onKeyDown={interactive && sectionKey ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openSection(sectionKey); } } : undefined}
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_24px_rgba(30,64,175,0.05)] transition sm:p-6 ${interactive ? 'cursor-pointer hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500' : ''} ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></span>
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );

  const Empty = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-slate-400">{children}</p>;

  return (
    <DashboardLayout
      role="student"
      title=""
      onLogout={logout}
    >
      <div className="w-full space-y-4 sm:space-y-5">
        <div className="relative -mx-4 -mt-3 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 pb-3 pt-3 sm:mx-0 sm:mt-0 sm:bg-none sm:px-1 sm:py-1">
          <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-blue-100/60 blur-2xl sm:hidden" />
          <div className="relative flex items-center gap-3 sm:gap-4">
          <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700 sm:grid"><UserRound className="h-7 w-7" /></span>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">My Profile</h2>
            <p className="mt-0.5 text-sm text-slate-600">Your complete profile at a glance</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-blue-700"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100"><Video className="h-4 w-4" /></span><span className="text-xs"><span className="block">Real interviews</span><strong className="text-sm">{interviewCounts.real ?? '—'}</strong></span></div>
            <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50/70 px-3 py-2 text-violet-700"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100"><Cpu className="h-4 w-4" /></span><span className="text-xs"><span className="block">AI interviews</span><strong className="text-sm">{interviewCounts.ai ?? '—'}</strong></span></div>
          </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-blue-100 bg-white/90 px-3 py-2.5 text-blue-700 shadow-sm"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100"><Video className="h-4 w-4" /></span><span className="min-w-0 text-xs"><span className="block leading-tight text-slate-600">Real Interviews</span><strong className="text-lg leading-5">{interviewCounts.real ?? '—'}</strong></span></div>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-violet-100 bg-white/90 px-3 py-2.5 text-violet-700 shadow-sm"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100"><Cpu className="h-4 w-4" /></span><span className="min-w-0 text-xs"><span className="block leading-tight text-slate-600">AI Interviews</span><strong className="text-lg leading-5">{interviewCounts.ai ?? '—'}</strong></span></div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-white via-blue-50/70 to-indigo-50/70 p-4 shadow-[0_8px_24px_rgba(30,64,175,0.05)] sm:p-5 lg:px-7 lg:py-6">
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 sm:h-20 sm:w-20">
              <div className="grid h-full w-full place-items-center overflow-hidden rounded-full border-4 border-white bg-blue-100 text-blue-700 shadow-sm">
                {profile.profile_picture ? <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10" />}
              </div>
              <label title="Change profile photo" className={`absolute bottom-0 right-0 grid h-7 w-7 cursor-pointer place-items-center rounded-full border-2 border-white bg-blue-700 text-white shadow ${uploadingPhoto ? 'pointer-events-none opacity-60' : ''}`}>
                <Pencil className="h-3.5 w-3.5" />
                <input type="file" accept="image/jpeg,image/png" className="sr-only" disabled={uploadingPhoto} onChange={(event) => { void handlePhotoUpload(event.target.files?.[0]); event.currentTarget.value = ''; }} />
              </label>
            </div>
            <div className="min-w-0 flex-1 basis-[calc(100%-6rem)] pr-20 sm:basis-0 sm:pr-0">
              <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-slate-950 sm:text-xl">{profile.name || 'Your name'}</h3><span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Student</span></div>
              <div className="mt-2 flex flex-col gap-1.5 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-5">
                <span className="flex items-center gap-2 break-all"><Mail className="h-4 w-4 shrink-0 text-blue-600" />{profile.email}</span>
                {profile.phone && <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" />{profile.phone}</span>}
              </div>
            </div>
            <Button type="button" variant="accent" className="absolute right-0 top-0 !rounded-full !px-3 !py-2 text-xs sm:static sm:!rounded-md sm:!px-5 sm:!py-2.5 sm:text-sm" onClick={() => { setEditingSection(null); setEditing((value) => !value); }}>
              {editing ? <><X className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" /> Cancel</> : <><Pencil className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" /><span className="sm:hidden">Edit</span><span className="hidden sm:inline">Edit profile</span></>}
            </Button>
            <input
              ref={heroResumeInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleResumeUpload(file);
                event.currentTarget.value = '';
              }}
            />
            <button
              type="button"
              disabled={uploadingResume}
              onClick={() => heroResumeInputRef.current?.click()}
              className="hidden w-full items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-left transition hover:bg-emerald-50 disabled:opacity-60 sm:ml-auto sm:flex sm:w-auto sm:min-w-64 sm:max-w-[40%]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                {uploadingResume ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-emerald-800">
                  {uploadingResume ? 'Uploading…' : 'Upload resume'}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-600">
                  {profile.resume ? displayResumeName : 'PDF only, max 5MB'}
                </span>
              </span>
            </button>
          </div>
        </div>

        {!complete && (
          <div className="rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-4 py-3 text-sm text-ink-secondary">
            {t('dashboard.profile.incompleteHint')}
          </div>
        )}

        <div className="hidden gap-3 sm:gap-4 md:grid md:grid-cols-2">
          <Section title="Personal details" icon={UserRound} sectionKey="personal">
            <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2.5 text-sm"><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-800">{profile.name || '—'}</dd><dt className="text-slate-500">Email</dt><dd className="break-all font-medium text-slate-800">{profile.email}</dd><dt className="text-slate-500">Contact number</dt><dd className="font-medium text-slate-800">{profile.phone || '—'}</dd></dl>
          </Section>
          <Section title="Education" icon={GraduationCap} sectionKey="education">
            {profile.degree || profile.branch || profile.institution ? <><p className="font-semibold text-slate-900">{[profile.degree, profile.branch || profile.major].filter(Boolean).join(' in ')}</p><p className="mt-1 text-sm text-slate-600">{[profile.institution, profile.graduation_year].filter(Boolean).join(' · ')}</p>{profile.btech_cgpa != null && <p className="mt-2 text-xs text-slate-500">CGPA: {profile.btech_cgpa}</p>}</> : <Empty>Add your education details to your profile.</Empty>}
          </Section>
          <Section title="Skills" icon={Code2} sectionKey="skills">
            {skills.length ? <div className="flex flex-wrap gap-2">{skills.map((skill, index) => <span key={`${skill}-${index}`} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800">{skill}</span>)}</div> : <Empty>Add your skills to help employers understand your strengths.</Empty>}
            {profile.soft_skills && <p className="mt-3 text-sm text-slate-600"><span className="font-medium text-slate-700">Strengths:</span> {profile.soft_skills}</p>}
          </Section>
          <Section title="Experience" icon={Briefcase} sectionKey="experience">
            {profile.internship_experience ? <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{profile.internship_experience}</p> : <Empty>Add internships or work experience to your profile.</Empty>}
          </Section>
          <Section title="Projects" icon={Rocket} sectionKey="projects">
            {profile.project_details ? <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{profile.project_details}</p> : <Empty>Add projects you have worked on.</Empty>}
          </Section>
          <Section title="Certifications" icon={Award} sectionKey="certifications">
            {certifications.length ? <ul className="space-y-2">{certifications.map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm text-slate-700"><Award className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul> : <Empty>Add your certifications to showcase your learning.</Empty>}
          </Section>
          <Section title="Career preferences" icon={Target} sectionKey="preferences">
            {preferences.length ? <ul className="space-y-2 text-sm text-slate-700">{profile.job_roles_of_interest && <li><span className="font-medium">Preferred roles:</span> {profile.job_roles_of_interest}</li>}{profile.preferred_industry && <li><span className="font-medium">Preferred domain:</span> {profile.preferred_industry}</li>}{profile.location_preferences && <li><span className="font-medium">Preferred location:</span> {profile.location_preferences}</li>}</ul> : <Empty>Set your preferred roles, domain and location.</Empty>}
          </Section>
        </div>

        <div className="space-y-2 md:hidden">
          {[
            { title: 'Personal Details', icon: UserRound, summary: [profile.name, profile.email, profile.phone].filter(Boolean).join(', ') || 'Add your contact details', section: 'personal' as const },
            { title: 'Education', icon: GraduationCap, summary: [[profile.degree, profile.branch || profile.major].filter(Boolean).join(' in '), profile.institution].filter(Boolean).join(' · ') || 'Add your education details', section: 'education' as const },
            { title: 'Skills', icon: Code2, summary: skills.length ? `${skills.slice(0, 4).join(', ')}${skills.length > 4 ? ', …' : ''}` : 'Add your skills', section: 'skills' as const },
            { title: 'Experience', icon: Briefcase, summary: profile.internship_experience?.split('\n')[0] || 'Add your work experience', section: 'experience' as const },
            { title: 'Projects', icon: Rocket, summary: profile.project_details?.split('\n')[0] || 'Add your projects', section: 'projects' as const },
            { title: 'Certifications', icon: Award, summary: certifications.length ? `${certifications.slice(0, 2).join(', ')}${certifications.length > 2 ? ', …' : ''}` : 'Add your certifications', section: 'certifications' as const },
            { title: 'Career Preferences', icon: Target, summary: preferences.length ? preferences.join(', ') : 'Add your preferred roles, domain and location', section: 'preferences' as const },
          ].map(({ title, icon: Icon, summary, section }) => (
            <button key={title} type="button" onClick={() => openSection(section)} className="group flex min-h-[54px] w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-[0_3px_12px_rgba(30,64,175,0.04)] transition hover:border-blue-200 hover:bg-blue-50/30">
              <Icon className="h-6 w-6 shrink-0 text-blue-600" />
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-5 text-slate-900">{title}</span><span className="block truncate text-xs leading-4 text-slate-500">{summary}</span></span>
              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 transition group-hover:bg-blue-100">View</span>
            </button>
          ))}
        </div>

        <StudentResumeSection reloadToken={resumeReloadToken} onCurrentChange={handleCurrentResumeChange} />

        {activeSection && <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-[2px] sm:p-5">
          <button type="button" aria-label="Close section details" onClick={() => setActiveSection(null)} className="absolute inset-0 cursor-default" />
          <section role="dialog" aria-modal="true" aria-labelledby="profile-section-title" className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">{(() => {
                  const Icon = ({ personal: UserRound, education: GraduationCap, skills: Code2, experience: Briefcase, projects: Rocket, certifications: Award, preferences: Target, resume: FileText })[activeSection];
                  return <Icon className="h-5 w-5" />;
                })()}</span>
                <div><h2 id="profile-section-title" className="font-semibold text-slate-950">{sectionContent[activeSection].title}</h2><p className="mt-0.5 text-xs text-slate-500">Your saved profile information</p></div>
              </div>
              <button type="button" aria-label="Close section details" onClick={() => setActiveSection(null)} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[60dvh] overflow-y-auto px-5 py-5 sm:px-6">
              {sectionContent[activeSection].items.filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim()).length ? (
                <dl className="space-y-4">
                  {sectionContent[activeSection].items.filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim()).map((item) => (
                    <div key={item.label} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</dt>
                      <dd className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-slate-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center"><p className="font-medium text-slate-700">No details added yet</p><p className="mt-1 text-sm text-slate-500">{sectionContent[activeSection].emptyText}</p></div>}
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
              <Button type="button" variant="accent" onClick={() => openEditor(sectionContent[activeSection].targetId, activeSection)} className="w-full sm:w-auto">
                <Pencil className="mr-2 h-4 w-4" />{sectionContent[activeSection].items.some((item) => item.value !== undefined && item.value !== null && String(item.value).trim()) ? 'Edit section' : 'Add details'}
              </Button>
            </div>
          </section>
        </div>}

        {editing && <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-2 backdrop-blur-[2px] sm:p-5">
          <button type="button" aria-label="Close profile editor" onClick={closeEditor} className="absolute inset-0 cursor-default" />
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-editor-title"
            onSubmit={handleSave}
            className="relative flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[92dvh]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2 id="profile-editor-title" className="text-lg font-bold text-slate-950 sm:text-xl">{editingSection ? `Edit ${sectionContent[editingSection].title}` : 'Edit your profile'}</h2>
                <p className="mt-1 text-sm text-slate-500">{editingSection ? 'Update the information for this section.' : 'Update your details and career information.'}</p>
              </div>
              <button type="button" aria-label="Close profile editor" onClick={closeEditor} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X className="h-5 w-5" /></button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
              {!editingSection && <div className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">Your information helps employers understand your background and career goals.</div>}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(!editingSection || editingSection === 'personal') && <>
            <Input
              id="edit-personal"
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
            </>}

            {(!editingSection || editingSection === 'education') && <>
            <Input id="edit-education" label="College / University" value={details.institution || ''} onChange={(e) => updateDetail('institution', e.target.value)} />
            <Input label="Degree" value={details.degree || ''} onChange={(e) => updateDetail('degree', e.target.value)} />
            <Input label="Branch / Specialization" value={details.branch || ''} onChange={(e) => updateDetail('branch', e.target.value)} />
            <Input label="Major" value={details.major || ''} onChange={(e) => updateDetail('major', e.target.value)} />
            <Input label="Graduation year" type="number" min={1900} max={2100} value={details.graduation_year ?? ''} onChange={(e) => updateDetail('graduation_year', e.target.value ? Number(e.target.value) : undefined)} />
            </>}

            {(!editingSection || editingSection === 'skills') && <>
            <label className="block text-sm font-medium text-ink-secondary md:col-span-2 xl:col-span-3">Technical skills
              <textarea id="edit-skills" rows={2} value={details.technical_skills || ''} onChange={(e) => updateDetail('technical_skills', e.target.value)} placeholder="Python, Java, React..." className="mt-1.5 w-full rounded-xl border border-line-default bg-white px-3 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
            </label>
            <label className="block text-sm font-medium text-ink-secondary md:col-span-2 xl:col-span-3">Soft skills
              <textarea rows={2} value={details.soft_skills || ''} onChange={(e) => updateDetail('soft_skills', e.target.value)} placeholder="Communication, collaboration..." className="mt-1.5 w-full rounded-xl border border-line-default bg-white px-3 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
            </label>
            </>}
            {(!editingSection || editingSection === 'experience') && <>
            <label className="block text-sm font-medium text-ink-secondary md:col-span-2 xl:col-span-3">Experience
              <textarea id="edit-experience" rows={3} value={details.internship_experience || ''} onChange={(e) => updateDetail('internship_experience', e.target.value)} placeholder="Role, company, dates and what you worked on" className="mt-1.5 w-full rounded-xl border border-line-default bg-white px-3 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
            </label>
            </>}
            {(!editingSection || editingSection === 'projects') && <>
            <label className="block text-sm font-medium text-ink-secondary md:col-span-2 xl:col-span-3">Projects
              <textarea id="edit-projects" rows={3} value={details.project_details || ''} onChange={(e) => updateDetail('project_details', e.target.value)} placeholder="Project name, technologies and a short description" className="mt-1.5 w-full rounded-xl border border-line-default bg-white px-3 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
            </label>
            </>}
            {(!editingSection || editingSection === 'certifications') && <>
            <label className="block text-sm font-medium text-ink-secondary md:col-span-2 xl:col-span-3">Certifications
              <textarea id="edit-certifications" rows={2} value={details.certifications || ''} onChange={(e) => updateDetail('certifications', e.target.value)} placeholder="Add certifications, separated by commas" className="mt-1.5 w-full rounded-xl border border-line-default bg-white px-3 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
            </label>
            </>}
            {(!editingSection || editingSection === 'preferences') && <>
            <Input id="edit-preferences" label="Preferred roles" value={details.job_roles_of_interest || ''} onChange={(e) => updateDetail('job_roles_of_interest', e.target.value)} />
            <Input label="Preferred domain" value={details.preferred_industry || ''} onChange={(e) => updateDetail('preferred_industry', e.target.value)} />
            <Input label="Preferred location" value={details.location_preferences || ''} onChange={(e) => updateDetail('location_preferences', e.target.value)} />
            </>}

            {(!editingSection || editingSection === 'resume') && <>
            <div className="scroll-mt-24 rounded-lg transition-shadow md:col-span-2 xl:col-span-3">
              <p className="mb-2 text-sm font-medium text-ink-secondary">
                {t('dashboard.profile.resume')} *
              </p>
              <p className="mb-3 text-xs text-ink-muted">
                Uploading adds a new resume to your history and sets it as current. Previous resumes stay saved.
              </p>
              <FileUpload
                type="document"
                currentFile={profile.resume}
                onFileSelect={handleResumeUpload}
                disabled={uploadingResume}
                placeholder={t('dashboard.profile.resumePlaceholder')}
              />
              {errors.resume && <p className="mt-2 text-xs text-brand-red">{errors.resume}</p>}
              <p className="mt-3 text-xs text-slate-500">
                Manage all resumes, set a current one, or remove older files from the Resume section on your profile.
              </p>
            </div>
            </>}
              </div>
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-white px-5 py-3 sm:flex-row sm:justify-end sm:px-7 sm:py-4">
              <Button type="button" variant="secondary" onClick={closeEditor} disabled={saving || uploadingResume} className="w-full sm:w-auto">Cancel</Button>
              <Button type="submit" variant="accent" disabled={saving || uploadingResume} className="w-full sm:w-auto">
                {saving ? 'Saving…' : t('dashboard.profile.save')}
              </Button>
            </div>
          </form>
        </div>}
      </div>
    </DashboardLayout>
  );
}
