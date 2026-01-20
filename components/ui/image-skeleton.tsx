import { cn } from "@/lib/utils"

interface ImageSkeletonProps {
  className?: string
  variant?: "default" | "rounded" | "circular"
  aspectRatio?: "square" | "video" | "auto"
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

export function ImageSkeleton({ 
  className, 
  variant = "default",
  aspectRatio = "auto"
}: ImageSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        variantClasses[variant],
        aspectRatioClasses[aspectRatio],
        className
      )}
      role="status"
      aria-label="Loading image"
    >
      <span className="sr-only">Loading image...</span>
    </div>
  )
}

