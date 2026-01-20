# Getting Started Guide

This guide will help you get started with the Shortlisted UI project.

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Project Architecture

### App Router Structure

The project uses Next.js 14 App Router. All pages are defined in the `app/` directory.

### Component Organization

- **UI Components** (`components/ui/`): Reusable, generic components
- **Feature Components** (`components/`): Feature-specific components
- **Providers** (`components/providers/`): Context providers

### Styling Approach

- Use Tailwind CSS utility classes
- Create reusable component variants using `class-variance-authority`
- Use CSS variables for theme colors
- Follow mobile-first responsive design

## Creating a New Page

1. Create a new folder in `app/` directory
2. Add a `page.tsx` file
3. Export a default component

Example:
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}
```

## Creating a New Component

1. Create component file in appropriate directory
2. Use TypeScript interfaces for props
3. Export the component

Example:
```tsx
// components/ui/MyComponent.tsx
import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  )
}
```

## Best Practices

1. **Component Size**: Keep components under 300 lines
2. **Reusability**: Extract common patterns into reusable components
3. **Type Safety**: Always use TypeScript types
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Include ARIA labels and semantic HTML

