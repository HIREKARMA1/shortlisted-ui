# Component Development Guidelines

## Component Structure

### Basic Component Template

```tsx
"use client" // Only if using hooks or client-side features

import { cn } from "@/lib/utils"
import { type ComponentProps } from "react"

interface ComponentNameProps {
  className?: string
  // Add other props
}

export function ComponentName({ 
  className,
  ...props 
}: ComponentNameProps) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* Component content */}
    </div>
  )
}
```

## Component Variants

Use `class-variance-authority` for component variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        sm: "small-classes",
        md: "medium-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface ComponentProps extends VariantProps<typeof componentVariants> {
  // other props
}
```

## Dark Mode Support

Always consider dark mode when styling:

```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper focus states

## Performance

- Use `React.memo` for components that receive stable props
- Lazy load heavy components
- Optimize images with Next.js Image component
- Avoid unnecessary re-renders

