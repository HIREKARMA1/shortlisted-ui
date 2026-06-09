import themeConfig from './theme.config.js';

export const theme = themeConfig;

export type Theme = typeof theme;

export function themeToCssVariables(t: Theme = theme): Record<string, string> {
  const vars: Record<string, string> = {
    '--font-sans': t.fonts.sans,
    '--font-display': t.fonts.display,
    '--font-mono': t.fonts.mono,
    '--radius-sm': t.radius.sm,
    '--radius-md': t.radius.md,
    '--radius-lg': t.radius.lg,
    '--radius-xl': t.radius.xl,
    '--color-primary': t.colors.primary[500],
    '--color-primary-hover': t.colors.primary[600],
    '--color-primary-soft': t.colors.primary[50],
    '--color-secondary': t.colors.secondary[500],
    '--color-accent-yellow': t.colors.accent.yellow,
    '--color-accent-orange': t.colors.accent.orange,
    '--color-accent-red': t.colors.accent.red,
    '--color-accent-green': t.colors.accent.green,
    '--color-surface-page': t.colors.surface.page,
    '--color-surface-card': t.colors.surface.card,
    '--color-surface-muted': t.colors.surface.muted,
    '--color-text-primary': t.colors.text.primary,
    '--color-text-secondary': t.colors.text.secondary,
    '--color-text-muted': t.colors.text.muted,
    '--color-text-inverse': t.colors.text.inverse,
    '--color-text-link': t.colors.text.link,
    '--color-border': t.colors.border.default,
    '--color-border-strong': t.colors.border.strong,
    '--color-border-focus': t.colors.border.focus,
    '--color-success': t.colors.semantic.success,
    '--color-warning': t.colors.semantic.warning,
    '--color-error': t.colors.semantic.error,
    '--color-info': t.colors.semantic.info,
    '--shadow-sm': t.colors.shadow.sm,
    '--shadow-md': t.colors.shadow.md,
    '--shadow-lg': t.colors.shadow.lg,
  };
  Object.entries(t.colors.primary).forEach(([k, v]) => {
    vars[`--color-primary-${k}`] = v;
  });
  Object.entries(t.colors.neutral).forEach(([k, v]) => {
    vars[`--color-neutral-${k}`] = v;
  });
  return vars;
}
