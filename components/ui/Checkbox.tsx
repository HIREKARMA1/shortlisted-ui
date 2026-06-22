'use client';

import { cn } from '@/lib/utils';
import type { ChangeEvent, ReactNode } from 'react';

type CheckboxProps = {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: ReactNode;
};

export function Checkbox({
  id,
  checked,
  onCheckedChange,
  onChange,
  disabled,
  className,
  label,
}: CheckboxProps) {
  const input = (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => {
        onChange?.(e);
        onCheckedChange?.(e.target.checked);
      }}
      className={cn(
        'h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500',
        className
      )}
    />
  );

  if (!label) return input;

  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      {input}
      <span>{label}</span>
    </label>
  );
}
