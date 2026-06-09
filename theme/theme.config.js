/**
 * SINGLE SOURCE OF TRUTH — change colors, fonts, radii, shadows here only.
 * Used by: theme/index.ts (CSS variables) and tailwind.config.js (utility classes)
 */
module.exports = {
  fonts: {
    sans: 'Inter',
    display: 'DM Sans',
    mono: 'JetBrains Mono',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  colors: {
    primary: {
      50: '#e6f3ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da5ff',
      400: '#1a8bff',
      500: '#1b52a4',
      600: '#154a8f',
      700: '#0f427a',
      800: '#093a65',
      900: '#033250',
    },
    secondary: {
      500: '#00a2e5',
      600: '#0091cc',
      700: '#0080b3',
    },
    accent: {
      yellow: '#fec40d',
      orange: '#f58020',
      red: '#d64246',
      green: '#098855',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    surface: {
      page: '#f8fafc',
      card: '#ffffff',
      muted: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#64748b',
      inverse: '#ffffff',
      link: '#1b52a4',
    },
    border: {
      default: '#e2e8f0',
      strong: '#cbd5e1',
      focus: '#1b52a4',
    },
    semantic: {
      success: '#098855',
      warning: '#fec40d',
      error: '#d64246',
      info: '#00a2e5',
    },
    shadow: {
      sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
      md: '0 4px 12px rgba(27, 82, 164, 0.08)',
      lg: '0 12px 32px rgba(27, 82, 164, 0.12)',
    },
  },
};
