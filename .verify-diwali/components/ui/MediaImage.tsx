import { cn } from '@/lib/utils';
import { ImageSkeleton } from '@/components/ui/ImageSkeleton';

type MediaImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  rounded?: string;
  skeletonClassName?: string;
};

/** Renders an image when URL is present; otherwise a skeleton placeholder. */
export function MediaImage({
  src,
  alt,
  className,
  imgClassName,
  rounded = 'rounded-xl',
  skeletonClassName,
}: MediaImageProps) {
  const url = typeof src === 'string' ? src.trim() : '';

  if (!url) {
    return (
      <ImageSkeleton
        className={cn('h-full w-full', className, skeletonClassName)}
        rounded={rounded}
      />
    );
  }

  return (
    <div className={cn('relative overflow-hidden', rounded, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} className={cn('h-full w-full object-cover', imgClassName)} />
    </div>
  );
}
