import { ContentTree } from './types';

export function resolvePath(tree: ContentTree, path: string): string {
  const parts = path.split('.');
  let current: unknown = tree;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return path;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === 'string') return current;
  if (typeof current === 'number') return String(current);
  return path;
}

export function resolveWithParams(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}
