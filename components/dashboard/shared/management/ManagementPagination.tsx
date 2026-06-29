'use client';

import { Button } from '@/components/ui/Button';

const PAGE_SIZE = 10;

export function paginateItems<T>(items: T[], page: number, pageSize = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTotalPages(total: number, pageSize = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function getPageNumbers(totalPages: number, current: number): number[] {
  const maxButtons = 5;
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(1, Math.min(current - 2, totalPages - maxButtons + 1));
  return Array.from({ length: maxButtons }, (_, i) => start + i);
}

type ManagementPaginationProps = {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  summary: string;
  prevLabel: string;
  nextLabel: string;
  pageSize?: number;
};

export function ManagementPagination({
  page,
  total,
  onPageChange,
  summary,
  prevLabel,
  nextLabel,
  pageSize = PAGE_SIZE,
}: ManagementPaginationProps) {
  const totalPages = getTotalPages(total, pageSize);
  if (total <= pageSize) return null;

  const numbers = getPageNumbers(totalPages, page);

  return (
    <div className="flex flex-col gap-3 border-t border-line-default bg-surface-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink-muted">{summary}</p>
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-xs"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          {prevLabel}
        </Button>
        {numbers.map((n) => (
          <Button
            key={n}
            variant={n === page ? 'accent' : 'secondary'}
            className="min-w-9 px-3 py-1.5 text-xs"
            onClick={() => onPageChange(n)}
          >
            {n}
          </Button>
        ))}
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-xs"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

export function alternatingRowClass(index: number): string {
  const colors = [
    'bg-white',
    'bg-blue-50/40',
    'bg-green-50/35',
    'bg-orange-50/35',
  ];
  return `${colors[index % colors.length]} transition-colors hover:bg-primary-50/50`;
}

export function StudentAvatar({ name }: { name: string }) {
  const initial = (name.trim()[0] || '?').toUpperCase();
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-disha-500 to-brand-sky text-sm font-semibold text-white">
      {initial}
    </div>
  );
}
