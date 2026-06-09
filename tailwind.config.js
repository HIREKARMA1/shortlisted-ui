const theme = require('./theme/theme.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: theme.brand,
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        neutral: theme.colors.neutral,
        surface: theme.colors.surface,
        ink: theme.colors.text,
        line: theme.colors.border,
        state: theme.colors.semantic,
      },
      borderRadius: theme.radius,
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
