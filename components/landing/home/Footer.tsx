'use client';

import Link from 'next/link';
import { contactEmail, footerLinks } from '@/lib/home/content';
import { useHome } from './HomeProvider';

export function Footer() {
  const { siteInfo } = useHome();
  const email = siteInfo?.contact_email || contactEmail;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5EAF2] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 text-xs sm:text-sm text-[var(--muted)] sm:px-6">
        <div className="flex items-center gap-3">
          <img src="/images/shortlisted-logo.png" alt="Shortlisted" width={120} height={28} className="h-7 w-auto" />
          <span className="hidden sm:inline border-l border-[#E5EAF2] pl-3 text-xs text-[var(--muted)]">
            AI Virtual Placement Cell
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-medium">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-[var(--ink)]">
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${email}`} className="transition-colors hover:text-[var(--ink)]">
            {email}
          </a>
        </div>

        <span className="text-xs text-[var(--muted)]">
          © {year} Hirekarma Private Limited
        </span>
      </div>
    </footer>
  );
}
