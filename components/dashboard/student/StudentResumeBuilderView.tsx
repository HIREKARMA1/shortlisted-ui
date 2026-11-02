'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResumeBuilderPage } from '@/components/resume-builder';

export function StudentResumeBuilderView() {
  const { logout } = useAuth();
  useRoleGuard('student');
  useStudentActiveGate();

  return (
    <DashboardLayout role="student" title="Resume Builder" onLogout={logout}>
      <ResumeBuilderPage />
    </DashboardLayout>
  );
}
