import { cn } from '@/lib/utils';

type ImageSkeletonProps = {
  className?: string;
  rounded?: string;
};

/** Placeholder for images whose S3 URLs will be filled in content JSON later. */
export function ImageSkeleton({ className, rounded = 'rounded-xl' }: ImageSkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-neutral-100',
        rounded,
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-100 via-neutral-200/70 to-primary-50" />
    </div>
  );
}
