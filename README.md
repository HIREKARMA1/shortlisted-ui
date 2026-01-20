# Shortlisted UI

Modern, component-based UI platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with Radix UI primitives
- **Theme**: Dark mode & Light mode support via `next-themes`
- **State Management**: Zustand (ready for use)
- **Form Handling**: React Hook Form + Zod (ready for use)
- **HTTP Client**: Axios (ready for use)

## 📁 Project Structure

```
shortlisted-ui/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles and Tailwind directives
├── components/             # React components
│   ├── ui/                 # Reusable UI components (Button, Card, Input, etc.)
│   └── providers/          # Context providers (Theme, etc.)
├── lib/                    # Utility libraries
│   ├── utils.ts            # Utility functions (cn, formatDate, etc.)
│   └── config.ts           # Application configuration
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── contexts/               # React contexts
├── services/               # API service functions
├── docs/                   # Documentation
└── public/                 # Static assets
    └── images/             # Image assets
```

## 🎨 Features

- ✅ **Dark Mode & Light Mode**: Full theme support with system preference detection
- ✅ **Component-Based Architecture**: Reusable, maintainable components
- ✅ **TypeScript**: Full type safety
- ✅ **Modern UI**: Clean, responsive design with Tailwind CSS
- ✅ **Code Quality**: ESLint configured, strict TypeScript
- ✅ **Optimized**: Next.js optimizations for production
- ✅ **Image Optimization**: Lazy loading with skeleton loaders for AWS S3 images

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎯 Code Standards

### Component Structure

- Keep components small and focused (single responsibility)
- Use TypeScript interfaces for props
- Prefer functional components with hooks
- Extract reusable logic into custom hooks
- Use composition over inheritance

### File Naming

- Components: PascalCase (e.g., `Button.tsx`, `UserCard.tsx`)
- Utilities: camelCase (e.g., `utils.ts`, `formatDate.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`, `useTheme.ts`)
- Types: camelCase (e.g., `user.ts`, `api.ts`)

### Code Organization

- One component per file
- Keep files under 300 lines when possible
- Extract complex logic into separate utilities or hooks
- Use absolute imports with `@/` prefix

## 🌙 Theme System

The application supports both dark and light modes. The theme is managed by `next-themes` and can be toggled using the `ThemeToggle` component.

### Using Theme

```tsx
import { useTheme } from "next-themes"

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

## 📦 Component Library

### Available Components

- `Button` - Versatile button component with variants
- `Card` - Container component with header, content, footer
- `Input` - Form input component
- `Label` - Form label component
- `ThemeToggle` - Theme switcher component
- `Loader` - Loading spinner component
- `OptimizedImage` - Image component with lazy loading and skeleton loader (AWS S3 ready)
- `ImageCard` - Image wrapped in card with skeleton loading
- `ImageSkeleton` - Skeleton loader for images

### Using Components

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## 🚢 Deployment

### Vercel Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

The project is configured for Vercel deployment out of the box.

## 📚 Documentation

Additional documentation can be found in the `docs/` folder:

- [Getting Started](./docs/getting-started.md) - Setup and basic usage
- [Component Guidelines](./docs/component-guidelines.md) - Component development standards
- [Image Optimization](./docs/image-optimization.md) - Image components with lazy loading
- [Project Structure](./docs/project-structure.md) - Complete folder structure
- [Tech Stack](./docs/tech-stack.md) - Technology stack details

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
```

### Tailwind Configuration

Customize colors, spacing, and other design tokens in `tailwind.config.js`.

## 🤝 Contributing

1. Follow the code standards outlined above
2. Keep components small and focused
3. Write clear, self-documenting code
4. Use TypeScript types properly
5. Test your changes before committing

## 📄 License

Private project - All rights reserved

