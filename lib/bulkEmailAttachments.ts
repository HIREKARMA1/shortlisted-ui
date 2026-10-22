export type AttachmentPolicy = {
  max_file_bytes: number;
  max_total_bytes: number;
  max_message_bytes: number;
  max_files: number;
  allowed_extensions: string[];
};

export type SelectedAttachment = {
  id: string;
  file: File;
  name: string;
  size: number;
  extension: string;
  typeLabel: string;
};

export const DEFAULT_ATTACHMENT_POLICY: AttachmentPolicy = {
  max_file_bytes: 5 * 1024 * 1024,
  max_total_bytes: 7 * 1024 * 1024,
  max_message_bytes: 10 * 1024 * 1024,
  max_files: 10,
  allowed_extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'png', 'jpg', 'jpeg'],
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function acceptAttribute(policy: AttachmentPolicy): string {
  return policy.allowed_extensions.map((extension) => `.${extension}`).join(',');
}

function extensionOf(name: string): string {
  const base = name.split(/[/\\]/).pop() || name;
  const parts = base.split('.');
  if (parts.length < 2) return '';
  return parts.pop()?.toLowerCase() || '';
}

function fileKey(file: File): string {
  return `${file.name}\0${file.size}\0${file.lastModified}`;
}

const CLIPBOARD_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'text/csv': 'csv',
};

function withClipboardName(file: File): File {
  if (extensionOf(file.name)) return file;
  const extension = CLIPBOARD_EXTENSIONS[file.type.toLowerCase()];
  if (!extension) return file;
  return new File([file], `pasted-file.${extension}`, { type: file.type, lastModified: file.lastModified });
}

export function filesFromClipboard(data: DataTransfer | null): File[] {
  if (!data) return [];
  try {
    const listed = Array.from(data.files ?? []);
    const source = listed.length
      ? listed
      : Array.from(data.items ?? []).flatMap((item) => {
          if (item.kind !== 'file') return [];
          const file = item.getAsFile();
          return file ? [file] : [];
        });
    const files = new Map<string, File>();
    source.forEach((file) => {
      const named = withClipboardName(file);
      files.set(fileKey(named), named);
    });
    return Array.from(files.values());
  } catch {
    return [];
  }
}

export function removeSelectedAttachment(items: SelectedAttachment[], id: string): SelectedAttachment[] {
  return items.filter((item) => item.id !== id);
}

export function addAttachmentFiles(
  current: SelectedAttachment[],
  incoming: File[],
  policy: AttachmentPolicy
): { attachments: SelectedAttachment[]; errors: string[] } {
  const errors: string[] = [];
  const attachments = [...current];
  const seen = new Set(current.map((item) => fileKey(item.file)));
  const allowed = new Set(policy.allowed_extensions.map((extension) => extension.toLowerCase()));

  incoming.forEach((file, index) => {
    const extension = extensionOf(file.name);
    const label = file.name.split(/[/\\]/).pop() || 'attachment';
    if (!extension || !allowed.has(extension)) {
      errors.push(`${label} is not an allowed file type.`);
      return;
    }
    if (!file.size) {
      errors.push(`${label} is empty.`);
      return;
    }
    if (file.size > policy.max_file_bytes) {
      errors.push(`${label} exceeds the maximum file size.`);
      return;
    }
    if (attachments.length >= policy.max_files) {
      errors.push(`You can attach up to ${policy.max_files} files.`);
      return;
    }
    const nextTotal = attachments.reduce((sum, item) => sum + item.size, 0) + file.size;
    if (nextTotal > policy.max_total_bytes) {
      errors.push('The selected attachments exceed the total size limit.');
      return;
    }
    const key = fileKey(file);
    if (seen.has(key)) {
      errors.push(`${label} is already attached.`);
      return;
    }
    seen.add(key);
    attachments.push({
      id: `${key}:${index}:${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: label,
      size: file.size,
      extension,
      typeLabel: extension.toUpperCase(),
    });
  });

  return { attachments, errors };
}
