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
  Video,
  MessageCircle,
  Clapperboard,
  UsersRound,
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
  { href: '/dashboard/student/classes', labelKey: 'common.nav.classes', icon: Video },
];

export const adminNav: NavItem[] = [
  { href: '/dashboard/admin', labelKey: 'common.nav.batches', icon: Users, exact: true },
  { href: '/dashboard/admin/students', labelKey: 'common.nav.students', icon: GraduationCap },
  { href: '/dashboard/admin/jobs', labelKey: 'common.nav.jobs', icon: Briefcase },
  { href: '/dashboard/admin/classes', labelKey: 'common.nav.classes', icon: Video },
  { href: '/dashboard/admin/testimonials', labelKey: 'common.nav.testimonials', icon: MessageCircle },
  { href: '/dashboard/admin/success-stories', labelKey: 'common.nav.successStories', icon: Clapperboard },
];

export const superAdminNav: NavItem[] = [
  { href: '/dashboard/super-admin/students', labelKey: 'common.nav.students', icon: GraduationCap },
  { href: '/dashboard/super-admin/coordinators', labelKey: 'common.nav.coordinators', icon: UserCog },
  { href: '/dashboard/super-admin/jobs', labelKey: 'common.nav.jobs', icon: Briefcase },
  { href: '/dashboard/super-admin/revenue', labelKey: 'common.nav.revenue', icon: IndianRupee },
  { href: '/dashboard/super-admin/classes', labelKey: 'common.nav.classes', icon: Video },
  { href: '/dashboard/super-admin/testimonials', labelKey: 'common.nav.testimonials', icon: MessageCircle },
  { href: '/dashboard/super-admin/success-stories', labelKey: 'common.nav.successStories', icon: Clapperboard },
  { href: '/dashboard/super-admin/community', labelKey: 'common.nav.community', icon: UsersRound },
];

export function getNavForRole(role: DashboardRole): NavItem[] {
  if (role === 'admin') return adminNav;
  if (role === 'super_admin') return superAdminNav;
  return studentNav;
}
