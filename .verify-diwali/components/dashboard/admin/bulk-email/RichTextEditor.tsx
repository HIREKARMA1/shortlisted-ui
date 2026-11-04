'use client';

import { useCallback, useEffect, useRef, type ClipboardEvent } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Indent,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Outdent,
  Underline,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { filesFromClipboard } from '@/lib/bulkEmailAttachments';
import { clipboardFileKind, imagePasteError, inlineImageMarkup } from '@/lib/inlineEmailImage';
import { normalizeClipboardHtml, plainTextToHtml, sanitizePastedHtml } from '@/lib/sanitizePastedHtml';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onPasteFiles?: (files: File[]) => void;
  maxImageBytes?: number;
  placeholder?: string;
  className?: string;
}

function insertHtmlAtCaret(editor: HTMLElement, html: string) {
  editor.focus();
  const template = document.createElement('template');
  template.innerHTML = html;
  const fragment = template.content;
  const selection = window.getSelection();
  const hasSelection =
    !!selection && selection.rangeCount > 0 && !!selection.anchorNode && editor.contains(selection.anchorNode);

  if (!hasSelection || !selection) {
    if (!editor.textContent?.trim()) editor.replaceChildren();
    editor.appendChild(fragment);
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();
  const lastNode = fragment.lastChild;
  range.insertNode(fragment);
  if (lastNode?.parentNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export function RichTextEditor({
  value,
  onChange,
  onPasteFiles,
  maxImageBytes = 5 * 1024 * 1024,
  placeholder = 'Compose your email...',
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const writtenHtml = useRef<string | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || writtenHtml.current === value) return;
    if (editor.innerHTML !== value) editor.innerHTML = value;
    writtenHtml.current = value;
  }, [value]);

  const exec = useCallback(
    (command: string, commandValue?: string) => {
      document.execCommand(command, false, commandValue);
      if (editorRef.current) {
        writtenHtml.current = editorRef.current.innerHTML;
        onChange(editorRef.current.innerHTML);
      }
      editorRef.current?.focus();
    },
    [onChange]
  );

  const publish = () => {
    if (!editorRef.current) return;
    writtenHtml.current = editorRef.current.innerHTML;
    onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    publish();
  };

  const handleLink = () => {
    const url = window.prompt('Enter link URL (include https://)');
    if (url && /^(https?:\/\/|mailto:|tel:)/i.test(url.trim())) {
      exec('createLink', url.trim());
    }
  };

  const readImageSource = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(new Error('unreadable'));
      reader.readAsDataURL(file);
    });

  const measureImageWidth = (src: string) =>
    new Promise<number>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image.naturalWidth || 0);
      image.onerror = () => resolve(0);
      image.src = src;
    });

  const insertClipboardImages = async (images: File[]) => {
    for (const file of images) {
      const problem = imagePasteError(file, maxImageBytes);
      if (problem) {
        toast.error(problem);
        continue;
      }
      try {
        const source = await readImageSource(file);
        if (!editorRef.current) return;
        const width = await measureImageWidth(source);
        const markup = inlineImageMarkup(source, width);
        if (!markup) {
          toast.error(`${file.name || 'This image'} could not be read from the clipboard.`);
          continue;
        }
        insertHtmlAtCaret(editorRef.current, markup);
        publish();
      } catch {
        toast.error(`${file.name || 'This image'} could not be read from the clipboard.`);
      }
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const files = filesFromClipboard(event.clipboardData);
    const images = files.filter((file) => clipboardFileKind(file) === 'inline');
    const unsupported = files.filter((file) => clipboardFileKind(file) === 'unsupported');
    const otherFiles = files.filter((file) => clipboardFileKind(file) === 'other');
    const html = normalizeClipboardHtml(event.clipboardData.getData('text/html'));
    const text = event.clipboardData.getData('text/plain');
    const trimmedText = text.trim();
    const filePathOnly =
      !html.trim() &&
      (!trimmedText ||
        otherFiles.some(
          (file) =>
            trimmedText === file.name ||
            trimmedText.endsWith(`\\${file.name}`) ||
            trimmedText.endsWith(`/${file.name}`)
        ));

    if (images.length || unsupported.length || otherFiles.length) {
      event.preventDefault();
      event.stopPropagation();
    }
    unsupported.forEach((file) => {
      const problem = imagePasteError(file, maxImageBytes);
      if (problem) toast.error(problem);
    });
    if (otherFiles.length) onPasteFiles?.(otherFiles);
    if (images.length) void insertClipboardImages(images);

    if ((images.length || otherFiles.length) && filePathOnly) return;

    let clean = '';
    try {
      clean = html.trim() ? sanitizePastedHtml(html) : '';
      if (images.length) clean = clean.replace(/<img\b[^>]*>/gi, '');
      if (!clean.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()) {
        clean = images.length ? '' : plainTextToHtml(text);
      }
    } catch {
      return;
    }
    if (!clean || !editorRef.current) return;
    event.preventDefault();
    insertHtmlAtCaret(editorRef.current, clean);
    publish();
  };

  return (
    <div className={cn('overflow-hidden rounded-lg border border-line-default bg-white', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-line-default bg-surface-muted p-2">
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('bold')} aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('italic')} aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('underline')} aria-label="Underline">
          <Underline className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('insertUnorderedList')} aria-label="Bullet list">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('insertOrderedList')} aria-label="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={handleLink} aria-label="Insert link">
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('justifyLeft')} aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('justifyCenter')} aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('justifyRight')} aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('outdent')} aria-label="Decrease indent">
          <Outdent className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" className="px-2 py-1" onClick={() => exec('indent')} aria-label="Increase indent">
          <Indent className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className="min-h-[220px] max-h-[420px] overflow-y-auto p-4 text-sm leading-7 text-ink-primary focus:outline-none empty:before:text-ink-muted empty:before:content-[attr(data-placeholder)] [&_a]:text-brand-blue [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
        onInput={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
      />
    </div>
  );
}
