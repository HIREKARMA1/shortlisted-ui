'use client';

import { Search } from 'lucide-react';

type ManagementSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
};

export function ManagementSearchInput({
  value,
  onChange,
  placeholder,
  label,
}: ManagementSearchInputProps) {
  return (
    <div>
      {label ? (
        <label className="mb-1.5 block text-sm font-medium text-ink-secondary">{label}</label>
      ) : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-line-default bg-white py-2.5 pl-10 pr-3 text-sm text-ink-primary shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
    </div>
  );
}
