'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { ContactSupportContent } from '@/components/contact/ContactSupportContent';

export function ContactSupportView({ role }: { role: DashboardRole }) {
  const { logout } = useAuth();
  const { ready } = useRoleGuard(role);

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout role={role} title="" subtitle="" onLogout={logout}>
      <ContactSupportContent variant="dashboard" />
    </DashboardLayout>
  );
}
