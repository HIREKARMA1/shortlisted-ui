# Tech Stack Documentation

## Core Technologies

### Next.js 14
- **Version**: 14.0.4
- **Router**: App Router (latest)
- **Features Used**:
  - Server Components (default)
  - Client Components (when needed with "use client")
  - File-based routing
  - Built-in optimizations

### TypeScript
- **Version**: 5.3.3
- **Configuration**: Strict mode enabled
- **Path Aliases**: Configured with `@/` prefix
- **Type Safety**: Full type checking enabled

### Tailwind CSS
- **Version**: 3.4.0
- **Dark Mode**: Class-based (`dark:` prefix)
- **Plugins**: 
  - `@tailwindcss/forms` - Form styling
- **Customization**: Extended theme with brand colors

## UI Libraries

### Radix UI
- **Components Used**:
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-label`
  - `@radix-ui/react-select`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-switch`
- **Purpose**: Accessible, unstyled UI primitives

### Lucide React
- **Version**: 0.303.0
- **Purpose**: Icon library
- **Usage**: Modern, consistent icons

### Heroicons
- **Version**: 2.2.0
- **Purpose**: Additional icon set
- **Usage**: Alternative icon library

## State Management

### Zustand
- **Version**: 4.4.7
- **Status**: Installed and ready to use
- **Purpose**: Lightweight state management

### React Query (TanStack Query)
- **Version**: 5.0.0
- **Status**: Installed and ready to use
- **Purpose**: Server state management and data fetching

## Form Handling

### React Hook Form
- **Version**: 7.48.2
- **Purpose**: Performant form handling

### Zod
- **Version**: 3.22.4
- **Purpose**: Schema validation
- **Integration**: Works with React Hook Form via `@hookform/resolvers`

## Styling Utilities

### class-variance-authority
- **Version**: 0.7.0
- **Purpose**: Component variant management

### clsx
- **Version**: 2.0.0
- **Purpose**: Conditional class names

### tailwind-merge
- **Version**: 2.2.0
- **Purpose**: Merge Tailwind classes intelligently

## Theme Management

### next-themes
- **Version**: 0.2.1
- **Purpose**: Dark mode and theme switching
- **Features**:
  - System preference detection
  - Persistent theme selection
  - No flash on page load

## Notifications

### react-hot-toast
- **Version**: 2.4.1
- **Purpose**: Toast notifications
- **Features**: Lightweight, customizable

## HTTP Client

### Axios
- **Version**: 1.6.2
- **Purpose**: HTTP requests
- **Status**: Ready for API integration

## Animations

### Framer Motion
- **Version**: 10.16.16
- **Purpose**: Animation library
- **Status**: Installed and ready to use

## Development Tools

### ESLint
- **Version**: 8.56.0
- **Config**: `eslint-config-next`
- **Purpose**: Code linting

### PostCSS
- **Version**: 8.4.32
- **Plugins**: Tailwind CSS, Autoprefixer
- **Purpose**: CSS processing

### Autoprefixer
- **Version**: 10.4.16
- **Purpose**: Automatic vendor prefixes

## Deployment

### Vercel Ready
- Configuration optimized for Vercel deployment
- Environment variables support
- Image optimization configured

## Future Backend Integration

The project is structured to easily integrate with:
- **Backend**: Python (FastAPI/Django)
- **Database**: PostgreSQL
- **ORM**: Alembic (migrations)
- **Location**: `shortlisted-server` folder (future)

