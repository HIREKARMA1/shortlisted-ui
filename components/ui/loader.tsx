import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-16 w-16 border-4",
}

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <div
      className={cn(
        "border-primary-500 border-t-transparent rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

