import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  Users,
  Shield,
  GraduationCap,
  UserCog,
  IndianRupee,
} from 'lucide-react';

export type DashboardRole = 'student' | 'admin' | 'super_admin';

export type NavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const studentNav: NavItem[] = [
  { href: '/dashboard/student', labelKey: 'common.nav.dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/student/jobs', labelKey: 'common.nav.jobs', icon: Briefcase },
  { href: '/dashboard/student/applications', labelKey: 'common.nav.applications', icon: ClipboardList },
];

export const adminNav: NavItem[] = [
  { href: '/dashboard/admin', labelKey: 'common.nav.batches', icon: Users, exact: true },
  { href: '/dashboard/admin/students', labelKey: 'common.nav.students', icon: GraduationCap },
  { href: '/dashboard/admin/jobs', labelKey: 'common.nav.jobs', icon: Briefcase },
];

export const superAdminNav: NavItem[] = [
  { href: '/dashboard/super-admin/students', labelKey: 'common.nav.students', icon: GraduationCap },
  { href: '/dashboard/super-admin/coordinators', labelKey: 'common.nav.coordinators', icon: UserCog },
  { href: '/dashboard/super-admin/jobs', labelKey: 'common.nav.jobs', icon: Briefcase },
  { href: '/dashboard/super-admin/revenue', labelKey: 'common.nav.revenue', icon: IndianRupee },
];

export function getNavForRole(role: DashboardRole): NavItem[] {
  if (role === 'admin') return adminNav;
  if (role === 'super_admin') return superAdminNav;
  return studentNav;
}
