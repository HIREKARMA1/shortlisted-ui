const BLOCK_TAGS = new Set([
  'p',
  'div',
  'li',
  'ul',
  'ol',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
]);
const TABLE_TAGS = new Set(['table', 'thead', 'tbody', 'tr', 'td', 'th']);
const SKIP_TAGS = new Set([
  'style',
  'script',
  'meta',
  'link',
  'title',
  'head',
  'xml',
  'noscript',
  'iframe',
  'object',
  'embed',
  'svg',
  'math',
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function normalizeClipboardHtml(raw: string): string {
  const fragment = raw.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/i);
  if (fragment?.[1].trim()) return fragment[1];
  const htmlStart = raw.search(/<(?:html|body)\b/i);
  if (htmlStart > 0) return raw.slice(htmlStart);
  return raw;
}

export function plainTextToHtml(text: string): string {
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+|\n+$/g, '');
  if (!normalized.trim()) return '';
  return normalized
    .split(/\n{2,}/)
    .map((block) => `<p>${block.split('\n').map(escapeHtml).join('<br>')}</p>`)
    .join('');
}

function styleMap(element: HTMLElement): Record<string, string> {
  const styles: Record<string, string> = {};
  (element.getAttribute('style') || '').split(';').forEach((part) => {
    const index = part.indexOf(':');
    if (index === -1) return;
    styles[part.slice(0, index).trim().toLowerCase()] = part.slice(index + 1).trim().toLowerCase();
  });
  return styles;
}

function safeImageSrc(value: string): string {
  const compact = value.trim().replace(/\s+/g, '');
  const data = /^data:image\/(png|jpeg|jpg|gif);base64,([a-z0-9+/=]+)$/i.exec(compact);
  if (data) {
    const subtype = data[1].toLowerCase() === 'jpg' ? 'jpeg' : data[1].toLowerCase();
    return `data:image/${subtype};base64,${data[2]}`;
  }
  const src = value.trim();
  if (!src || /[\s\0]/.test(src)) return '';
  if (/^(javascript|vbscript|file|blob):/i.test(src)) return '';
  if (/^https?:\/\//i.test(src)) return src;
  return '';
}

function imageWidthAttr(element: HTMLElement): number {
  const raw = element.getAttribute('width') || styleMap(element).width || '';
  const match = /^(\d+)(?:px)?$/i.exec(raw.trim());
  if (!match) return 0;
  const width = Number(match[1]);
  return width >= 1 && width <= 1200 ? width : 0;
}

function imageMarkup(element: HTMLElement): string {
  const src = safeImageSrc(element.getAttribute('src') || '');
  if (!src) return '';
  const width = imageWidthAttr(element);
  const alt = escapeHtml(element.getAttribute('alt') || 'Image');
  const widthAttr = width ? ` width="${width}"` : '';
  return `<img src="${escapeHtml(src)}" alt="${alt}"${widthAttr} style="max-width:100%;height:auto;display:block;border:0;margin:0 0 12px;" />`;
}

function safeHref(value: string): string {
  const href = value.trim();
  if (!href || /[\n\r\0]/.test(href)) return '';
  if (/^(javascript|data|vbscript|file):/i.test(href)) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  return '';
}

function indentPx(value: string): number {
  const match = /^(-?\d+(?:\.\d+)?)(px|pt|in|cm)?$/i.exec(value.trim());
  if (!match) return 0;
  let amount = Number(match[1]);
  const unit = (match[2] || 'px').toLowerCase();
  if (unit === 'pt') amount *= 1.333;
  if (unit === 'in') amount *= 96;
  if (unit === 'cm') amount *= 37.8;
  if (amount < 12) return 0;
  const steps = Math.round(amount / 24);
  return Math.max(24, Math.min(72, steps * 24));
}

function inlineHtml(element: HTMLElement, includeBlocks = false): string {
  let html = '';
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = (child.textContent || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');
      if (text) html += escapeHtml(text);
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (SKIP_TAGS.has(tag)) return;
    if (tag === 'br') {
      html += '<br>';
      return;
    }
    if (tag === 'img') {
      html += imageMarkup(el);
      return;
    }
    if (BLOCK_TAGS.has(tag) && !includeBlocks) return;
    let inner = inlineHtml(el, includeBlocks);
    if (!inner.trim()) return;
    const styles = styleMap(el);
    const weight = styles['font-weight'] || '';
    const fontStyle = styles['font-style'] || '';
    const decoration = styles['text-decoration'] || '';
    const numericWeight = Number(weight);
    const bold =
      (['b', 'strong'].includes(tag) && !['normal', '400'].includes(weight)) ||
      ['bold', '700', '800', '900'].includes(weight) ||
      (Number.isFinite(numericWeight) && numericWeight >= 600);
    const italic = (['i', 'em'].includes(tag) && fontStyle !== 'normal') || fontStyle === 'italic';
    const underline = tag === 'u' || decoration.includes('underline');
    if (bold) inner = `<strong>${inner}</strong>`;
    if (italic) inner = `<em>${inner}</em>`;
    if (underline) inner = `<u>${inner}</u>`;
    if (tag === 'a') {
      const href = safeHref(el.getAttribute('href') || '');
      if (href) inner = `<a href="${escapeHtml(href)}">${inner}</a>`;
    }
    html += inner;
  });
  return html.trim();
}

function blockStyle(element: HTMLElement): string {
  const styles = styleMap(element);
  const align = styles['text-align'] || (element.getAttribute('align') || '').toLowerCase();
  const indent = indentPx(styles['margin-left'] || styles['padding-left'] || styles['text-indent'] || '');
  const parts = ['margin:0 0 12px'];
  if (['left', 'center', 'right', 'justify'].includes(align)) parts.push(`text-align:${align}`);
  if (indent) parts.push(`margin-left:${indent}px`);
  return parts.join(';');
}

function blockHtml(element: HTMLElement): string {
  const tag = element.tagName.toLowerCase();
  if (TABLE_TAGS.has(tag)) {
    const nested = Array.from(element.children).filter((child) => BLOCK_TAGS.has(child.tagName.toLowerCase()));
    if (nested.length) return nested.map((child) => blockHtml(child as HTMLElement)).join('');
    const inner = inlineHtml(element);
    if (!inner) return '';
    return `<p style="${blockStyle(element)}">${inner}</p>`;
  }
  if (tag === 'ul' || tag === 'ol') {
    const items = Array.from(element.children)
      .filter((child) => child.tagName.toLowerCase() === 'li')
      .map((child) => `<li style="${blockStyle(child as HTMLElement)}">${inlineHtml(child as HTMLElement, true)}</li>`);
    if (!items.length) return '';
    return `<${tag} style="margin:0 0 12px;padding-left:24px;">${items.join('')}</${tag}>`;
  }
  const hasBlock = Array.from(element.children).some((child) => BLOCK_TAGS.has(child.tagName.toLowerCase()));
  if (hasBlock) {
    return Array.from(element.children)
      .filter((child) => BLOCK_TAGS.has(child.tagName.toLowerCase()))
      .map((child) => blockHtml(child as HTMLElement))
      .join('');
  }
  let inner = inlineHtml(element);
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) && inner) inner = `<strong>${inner}</strong>`;
  if (!inner) return `<p style="${blockStyle(element)}">&nbsp;</p>`;
  return `<p style="${blockStyle(element)}">${inner}</p>`;
}

function renderChildren(element: HTMLElement): string {
  let html = '';
  let inline = '';
  const flush = () => {
    const text = inline.trim();
    inline = '';
    if (text) html += `<p>${text}</p>`;
  };
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (SKIP_TAGS.has(tag)) return;
      const hasBlock = BLOCK_TAGS.has(tag) || Array.from(el.children).some((nested) => BLOCK_TAGS.has(nested.tagName.toLowerCase()));
      if (hasBlock && BLOCK_TAGS.has(tag)) {
        flush();
        html += blockHtml(el);
        return;
      }
      if (hasBlock) {
        flush();
        html += renderChildren(el);
        return;
      }
    }
    if (child.nodeType === Node.TEXT_NODE) {
      const text = (child.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) inline += escapeHtml(text);
      return;
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      inline += inlineHtml(child as HTMLElement);
    }
  });
  flush();
  return html.replace(/(?:<p style="[^"]*">&nbsp;<\/p>\s*){2,}/g, (match) => {
    const first = match.match(/<p style="[^"]*">&nbsp;<\/p>/);
    return first ? first[0] : '';
  });
}

export function sanitizePastedHtml(source: string): string {
  const raw = normalizeClipboardHtml(source);
  if (!raw.trim()) return '';
  if (typeof DOMParser === 'undefined') {
    return plainTextToHtml(raw.replace(/<[^>]+>/g, ' '));
  }
  const parsed = new DOMParser().parseFromString(raw, 'text/html');
  return renderChildren(parsed.body);
}
