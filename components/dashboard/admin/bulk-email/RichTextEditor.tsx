'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Underline } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Compose your email...',
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = useCallback(
    (command: string, commandValue?: string) => {
      document.execCommand(command, false, commandValue);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      editorRef.current?.focus();
    },
    [onChange]
  );

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = window.prompt('Enter link URL (include https://)');
    if (url) {
      exec('createLink', url);
    }
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
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className="min-h-[220px] max-h-[420px] overflow-y-auto p-4 text-sm text-ink-primary focus:outline-none empty:before:text-ink-muted empty:before:content-[attr(data-placeholder)] [&_a]:text-brand-blue [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </div>
  );
}
