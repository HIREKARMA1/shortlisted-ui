const INLINE_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/gif']);
const INLINE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif']);
const UNSUPPORTED_EXTENSIONS = new Set(['webp', 'bmp', 'svg', 'heic', 'avif', 'tif', 'tiff']);

export type ClipboardFileKind = 'inline' | 'unsupported' | 'other';

function extensionOf(name: string): string {
  const base = name.split(/[/\\]/).pop() || name;
  const parts = base.split('.');
  if (parts.length < 2) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function clipboardFileKind(file: File): ClipboardFileKind {
  const type = (file.type || '').toLowerCase();
  if (INLINE_TYPES.has(type)) return 'inline';
  if (type.startsWith('image/')) return 'unsupported';
  const extension = extensionOf(file.name);
  if (INLINE_EXTENSIONS.has(extension)) return 'inline';
  if (UNSUPPORTED_EXTENSIONS.has(extension)) return 'unsupported';
  return 'other';
}

export function isSafeInlineImageSource(src: string): boolean {
  return /^data:image\/(png|jpeg|gif);base64,[a-z0-9+/=]+$/i.test(src.trim());
}

export function inlineImageMarkup(src: string, width?: number): string {
  const source = src.trim();
  if (!isSafeInlineImageSource(source)) return '';
  const safeWidth = width && width > 0 ? Math.min(Math.round(width), 560) : 0;
  const widthAttr = safeWidth ? ` width="${safeWidth}"` : '';
  return `<img src="${source}" alt="Pasted image"${widthAttr} style="max-width:100%;height:auto;display:block;border:0;margin:0 0 12px;" />`;
}

export function imagePasteError(file: File, maxBytes: number): string | null {
  const kind = clipboardFileKind(file);
  const label = file.name.split(/[/\\]/).pop() || 'This image';
  if (kind === 'unsupported') {
    return `${label} cannot be pasted. Use a PNG, JPEG, or GIF image.`;
  }
  if (kind !== 'inline') return null;
  if (!file.size) return `${label} could not be read from the clipboard.`;
  if (file.size > maxBytes) return `${label} exceeds the maximum image size.`;
  return null;
}
