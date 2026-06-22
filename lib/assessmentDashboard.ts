import type { DashboardRole } from '@/lib/dashboard-nav';

export function assessmentBasePath(role: DashboardRole): string {
  return role === 'super_admin'
    ? '/dashboard/super-admin/assessments'
    : '/dashboard/admin/assessments';
}
