'use client';

import Link from 'next/link';
import { contactEmail, footerLinks } from '@/lib/home/content';
import { useHome } from './HomeProvider';

export function Footer() {
  const { siteInfo } = useHome();
  const email = siteInfo?.contact_email || contactEmail;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4 text-sm text-[var(--muted)] sm:px-6">
        <img src="/images/shortlisted-logo.png" alt="Shortlisted" width={120} height={28} className="h-7 w-auto" />
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-[var(--ink)]">
            {link.label}
          </Link>
        ))}
        <a href={`mailto:${email}`} className="hover:text-[var(--ink)]">{email}</a>
        <span className="sm:ml-auto">© {year} Hirekarma Private Limited</span>
      </div>
    </footer>
  );
}
