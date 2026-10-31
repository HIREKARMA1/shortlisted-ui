'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { categories, faqs, searchPages } from '@/lib/home/content';
import { useShell } from './ShellContext';

type Row = { group: string; label: string; href: string; hint: string };

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useShell();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const rows = useMemo<Row[]>(() => {
    const all: Row[] = [
      ...categories.map((item) => ({ group: 'Features', label: item.title, href: item.href, hint: item.caption })),
      ...searchPages.map((item) => ({ group: 'Pages', label: item.label, href: item.href, hint: item.hint })),
      ...faqs.map((item) => ({ group: 'FAQ', label: item.q, href: '#faq', hint: 'Answer' })),
    ];
    const q = query.trim().toLowerCase();
    const filtered = q ? all.filter((item) => `${item.label} ${item.hint} ${item.group}`.toLowerCase().includes(q)) : all;
    return filtered.slice(0, 10);
  }, [query]);

  useEffect(() => setActive(0), [query, paletteOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const go = (href: string) => {
      setPaletteOpen(false);
      if (href.startsWith('#')) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push(href);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPaletteOpen(false);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive((index) => Math.min(index + 1, Math.max(rows.length - 1, 0)));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive((index) => Math.max(index - 1, 0));
      }
      if (event.key === 'Enter' && rows[active]) {
        event.preventDefault();
        go(rows[active].href);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, rows, active, router, setPaletteOpen]);

  if (!paletteOpen) return null;
  const groups = Array.from(new Set(rows.map((row) => row.group)));

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]">
      <button type="button" aria-label="Close search" className="absolute inset-0 bg-[#0B1B33]/45" onClick={() => setPaletteOpen(false)} />
      <div role="dialog" aria-modal="true" aria-label="Search Shortlisted" className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <label className="flex items-center gap-2 border-b border-[var(--border)] px-4">
          <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search features, pages, and FAQ"
            className="h-12 w-full bg-transparent text-sm outline-none"
          />
        </label>
        <ul className="max-h-80 overflow-auto p-2" role="listbox">
          {rows.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-[var(--muted)]">No matches.</li>
          ) : (
            groups.map((group) => (
              <li key={group}>
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">{group}</p>
                <ul>
                  {rows
                    .filter((row) => row.group === group)
                    .map((row) => {
                      const index = rows.indexOf(row);
                      return (
                        <li key={`${row.group}-${row.label}`}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={index === active}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm ${index === active ? 'bg-[var(--bg)]' : ''}`}
                            onClick={() => {
                              setPaletteOpen(false);
                              if (row.href.startsWith('#')) {
                                document.querySelector(row.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              } else {
                                router.push(row.href);
                              }
                            }}
                          >
                            <span className="font-medium text-[var(--ink)]">{row.label}</span>
                            <span className="text-xs text-[var(--muted)]">{row.hint}</span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
