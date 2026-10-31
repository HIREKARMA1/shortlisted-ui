'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PrimaryLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(245,128,32,0.28)] transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function GhostLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${light ? 'text-white/75' : 'text-[var(--brand-sky)]'}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-2 font-bold tracking-tight ${light ? 'text-white' : 'text-[var(--ink)]'}`}
        style={{ fontFamily: 'var(--font-home-display), Inter, sans-serif', fontSize: 'clamp(1.55rem, 1.2rem + 0.9vw, 1.75rem)', letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-2 text-[14px] leading-relaxed sm:text-[15px] ${light ? 'text-white/80' : 'text-[var(--muted)]'}`}>{subtitle}</p>
      ) : null}
    </div>
  );
}

export function OutlineLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--brand-orange)] bg-transparent px-5 py-2.5 text-sm font-semibold text-[var(--brand-orange)] transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    const items = () =>
      Array.from(node?.querySelectorAll<HTMLElement>('button, a[href], input, textarea, select') ?? []);
    items()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center px-4">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-[#0B1B33]/45" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(11,27,51,0.16)]"
      >
        <h2 id="home-modal-title" className="text-xl font-semibold text-[var(--ink)]">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
