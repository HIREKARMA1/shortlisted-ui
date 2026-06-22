const theme = require('./theme/theme.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Iowan Old Style', 'Georgia', 'serif'],
        body: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: theme.brand,
        primary: {
          DEFAULT: theme.brand.blue,
          ...theme.colors.primary,
        },
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        neutral: theme.colors.neutral,
        surface: theme.colors.surface,
        muted: {
          DEFAULT: theme.colors.surface.muted,
          foreground: theme.colors.text.muted,
        },
        ink: {
          DEFAULT: theme.colors.text.primary,
          ...theme.colors.text,
        },
        line: {
          DEFAULT: theme.colors.border.default,
          ...theme.colors.border,
        },
        state: theme.colors.semantic,
        sky: theme.brand.sky,
        yellow: theme.brand.yellow,
        orange: theme.brand.orange,
        red: theme.brand.red,
        green: theme.brand.green,
        soft: theme.colors.surface.soft,
      },
      borderRadius: {
        ...theme.radius,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: theme.colors.shadow.md,
        elevated: theme.colors.shadow.lg,
      },
      backgroundImage: {
        'hero-gradient': 'var(--gradient-hero)',
        'brand-stripe': 'var(--gradient-brand-stripe)',
      },
    },
  },
  plugins: [],
};
