'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProfilePhotoDisplayProps = {
  photoUrl?: string | null;
  name?: string;
  size?: 'md' | 'lg';
  className?: string;
};

export function ProfilePhotoDisplay({ photoUrl, name, size = 'lg', className }: ProfilePhotoDisplayProps) {
  const dimension = size === 'lg' ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-20 w-20';
  const alt = name?.trim() ? `${name.trim()} profile photo` : 'Profile photo';

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={alt}
        className={cn('rounded-full border-2 border-line-default object-cover shadow-card', dimension, className)}
      />
    );
  }

  const initial = (name?.trim()?.[0] || '').toUpperCase();
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 border-line-default bg-gradient-to-br from-brand-blue/10 to-brand-sky/20 text-brand-blue shadow-card',
        dimension,
        className
      )}
      aria-label={alt}
      role="img"
    >
      {initial ? (
        <span className={size === 'lg' ? 'text-3xl font-semibold' : 'text-xl font-semibold'}>{initial}</span>
      ) : (
        <User className={size === 'lg' ? 'h-12 w-12 text-brand-blue/60' : 'h-8 w-8 text-brand-blue/60'} aria-hidden />
      )}
    </div>
  );
}
