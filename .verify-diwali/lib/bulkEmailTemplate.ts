const FORMULA_PREFIX = /^[=+\-@]/;

export const BULK_EMAIL_TEMPLATE_FILENAME = 'shortlisted_bulk_email_template.csv';
export const BULK_EMAIL_TEMPLATE_HEADER = 'email';
export const BULK_EMAIL_TEMPLATE_EXAMPLE = 'student@example.com';

export function escapeTemplateCell(value: string): string {
  let cell = value.replace(/"/g, '""');
  if (FORMULA_PREFIX.test(cell)) cell = `'${cell}`;
  if (/[",\r\n]/.test(cell)) return `"${cell}"`;
  return cell;
}

export function buildBulkEmailTemplateCsv(): string {
  return `\uFEFF${escapeTemplateCell(BULK_EMAIL_TEMPLATE_HEADER)}\r\n${escapeTemplateCell(BULK_EMAIL_TEMPLATE_EXAMPLE)}\r\n`;
}

export function downloadBulkEmailTemplate(): void {
  const blob = new Blob([buildBulkEmailTemplateCsv()], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = BULK_EMAIL_TEMPLATE_FILENAME;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
