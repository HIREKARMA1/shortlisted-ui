'use client';

import { BulkEmailManagement } from '@/components/dashboard/admin/bulk-email/BulkEmailManagement';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useTranslation } from '@/lib/i18n/context';
import type { DashboardRole } from '@/lib/dashboard-nav';

export function BulkEmailView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { ready } = useRoleGuard(role);

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout role={role} title={t('common.nav.bulkEmail')} onLogout={logout}>
      <BulkEmailManagement />
    </DashboardLayout>
  );
}
