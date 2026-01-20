"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ImageSkeleton } from "./image-skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  variant?: "default" | "rounded" | "circular"
  aspectRatio?: "square" | "video" | "auto"
  onLoad?: () => void
  onError?: () => void
}

/**
 * OptimizedImage Component
 * 
 * A wrapper around Next.js Image component with:
 * - Lazy loading (default)
 * - Skeleton loader while loading
 * - Error handling
 * - Support for AWS S3 images
 * - Dark mode support
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="https://bucket.s3.amazonaws.com/image.jpg"
 *   alt="Description"
 *   width={400}
 *   height={300}
 *   variant="rounded"
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes,
  objectFit = "cover",
  variant = "default",
  aspectRatio = "auto",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Check if the image is from S3 to use unoptimized (prevents server-side optimization timeouts)
  const isS3Image = src.includes('s3.amazonaws.com') || src.includes('s3.') && src.includes('.amazonaws.com')

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const variantClasses = {
    default: "rounded-lg",
    rounded: "rounded-xl",
    circular: "rounded-full",
  }

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  }

  // Error state - show placeholder
  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600",
          variantClasses[variant],
          aspectRatioClasses[aspectRatio],
          fill ? "w-full h-full" : "",
          className
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        variantClasses[variant],
        aspectRatioClasses[aspectRatio],
        fill ? "w-full h-full" : "",
        className
      )}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {/* Skeleton loader - shown while loading */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <ImageSkeleton
            variant={variant}
            aspectRatio={aspectRatio}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Next.js Image component */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        unoptimized={isS3Image}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          variantClasses[variant],
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down"
        )}
        priority={priority}
        sizes={sizes || (fill ? "100vw" : undefined)}
        loading={priority ? undefined : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

