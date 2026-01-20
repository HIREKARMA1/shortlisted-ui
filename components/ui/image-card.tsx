"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ImageSkeleton } from "./image-skeleton"
import { Card } from "./card"

interface ImageCardProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  variant?: "default" | "rounded" | "circular"
  aspectRatio?: "square" | "video" | "auto"
  showCard?: boolean
  cardClassName?: string
  onLoad?: () => void
  onError?: () => void
  children?: React.ReactNode
}

/**
 * ImageCard Component
 * 
 * An image component wrapped in a card with skeleton loading.
 * Perfect for displaying images in card layouts.
 * 
 * @example
 * ```tsx
 * <ImageCard
 *   src="https://bucket.s3.amazonaws.com/image.jpg"
 *   alt="Description"
 *   width={400}
 *   height={300}
 *   showCard
 * >
 *   <h3>Card Title</h3>
 * </ImageCard>
 * ```
 */
export function ImageCard({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  objectFit = "cover",
  variant = "default",
  aspectRatio = "auto",
  showCard = false,
  cardClassName,
  onLoad,
  onError,
  children,
}: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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

  const imageContent = (
    <div
      className={cn(
        "relative overflow-hidden",
        variantClasses[variant],
        aspectRatioClasses[aspectRatio],
        className
      )}
      style={width && height ? { width, height } : undefined}
    >
      {/* Skeleton loader */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <ImageSkeleton
            variant={variant}
            aspectRatio={aspectRatio}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600",
            variantClasses[variant]
          )}
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
      )}

      {/* Next.js Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
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
        sizes={sizes}
        loading={priority ? undefined : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )

  if (showCard) {
    return (
      <Card className={cn("overflow-hidden", cardClassName)}>
        {imageContent}
        {children && <div className="p-4">{children}</div>}
      </Card>
    )
  }

  return (
    <>
      {imageContent}
      {children}
    </>
  )
}

