# Project Structure

This document outlines the complete folder structure of the Shortlisted UI project.

```
shortlisted-ui/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with theme provider
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles and Tailwind directives
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button component with variants
│   │   ├── card.tsx             # Card component
│   │   ├── input.tsx            # Input component
│   │   ├── label.tsx            # Label component
│   │   ├── loader.tsx           # Loading spinner
│   │   └── theme-toggle.tsx     # Theme switcher
│   └── providers/               # Context providers
│       └── theme-provider.tsx   # Theme context provider
│
├── lib/                         # Utility libraries
│   ├── utils.ts                 # Utility functions (cn, formatDate, etc.)
│   └── config.ts                # Application configuration
│
├── hooks/                       # Custom React hooks
│   └── (add custom hooks here)
│
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Common types
│
├── utils/                       # Utility functions
│   └── (add utility functions here)
│
├── contexts/                    # React contexts
│   └── (add contexts here)
│
├── services/                    # API service functions
│   └── (add API services here)
│
├── docs/                        # Documentation
│   ├── getting-started.md       # Getting started guide
│   ├── component-guidelines.md  # Component development guidelines
│   └── project-structure.md     # This file
│
├── public/                      # Static assets
│   └── images/                  # Image assets
│
├── .env.example                 # Environment variables example
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── next-env.d.ts                # Next.js TypeScript definitions
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── README.md                    # Project README
└── tsconfig.json                # TypeScript configuration
```

## Directory Purposes

### `app/`
Next.js 14 App Router directory. All pages and layouts go here.

### `components/`
React components organized by purpose:
- `ui/`: Generic, reusable UI components
- `providers/`: Context providers for global state

### `lib/`
Shared utility libraries and configurations.

### `hooks/`
Custom React hooks for reusable logic.

### `types/`
TypeScript type definitions and interfaces.

### `utils/`
Pure utility functions (not React-specific).

### `contexts/`
React Context API implementations.

### `services/`
API service functions and data fetching logic.

### `docs/`
Project documentation and guides.

### `public/`
Static assets served directly by Next.js.

