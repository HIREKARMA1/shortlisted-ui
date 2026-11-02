'use client';

import { ButtonHTMLAttributes } from 'react';
import { Button as ShortlistedButton } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type DishaVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'gradient'
  | 'success'
  | 'warning'
  | 'info'
  | 'primary'
  | 'accent'
  | 'danger';
type DishaSize = 'default' | 'sm' | 'lg' | 'xl' | 'icon';

type CompatButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: DishaVariant;
  size?: DishaSize;
  asChild?: boolean;
};

const sizeClass: Record<DishaSize, string> = {
  default: '',
  sm: 'h-9 px-3 py-1.5 text-xs',
  lg: 'h-11 px-8',
  xl: 'h-12 px-10 text-base',
  icon: 'h-10 w-10 p-0',
};

function mapVariant(
  variant: DishaVariant = 'default'
): 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' {
  if (variant === 'outline' || variant === 'secondary' || variant === 'link') return 'secondary';
  if (variant === 'ghost') return 'ghost';
  if (variant === 'destructive' || variant === 'danger') return 'danger';
  if (variant === 'accent' || variant === 'warning') return 'accent';
  return 'primary';
}

export function Button({
  variant = 'default',
  size = 'default',
  className,
  asChild: _asChild,
  ...props
}: CompatButtonProps) {
  return (
    <ShortlistedButton
      variant={mapVariant(variant)}
      className={cn(sizeClass[size], 'normal-case tracking-normal font-semibold', className)}
      {...props}
    />
  );
}

export default Button;
