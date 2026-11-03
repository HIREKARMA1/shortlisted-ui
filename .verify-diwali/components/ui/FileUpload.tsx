'use client';

import { useRef, useState } from 'react';
import { AlertCircle, CheckCircle, FileText, Image, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  maxSize?: number;
  currentFile?: string | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: 'image' | 'document' | 'any';
};

export function FileUpload({
  onFileSelect,
  onFileRemove,
  maxSize = 5,
  currentFile,
  placeholder,
  className,
  disabled = false,
  type = 'any',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes =
    type === 'image'
      ? ['image/jpeg', 'image/jpg', 'image/png']
      : type === 'document'
        ? ['application/pdf']
        : ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please upload an image file only (JPG, PNG).');
      return;
    }
    if (type === 'document' && file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      return;
    }
    onFileSelect(file);
  };

  const icon =
    type === 'image' ? (
      <Image className="h-8 w-8 text-brand-sky" />
    ) : type === 'document' ? (
      <FileText className="h-8 w-8 text-brand-green" />
    ) : (
      <Upload className="h-8 w-8 text-ink-muted" />
    );

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        disabled={disabled}
      />

      {currentFile ? (
        <div className="space-y-3">
          <div className="rounded-lg border-2 border-brand-green/30 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-brand-green" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-green">File uploaded</p>
                <p className="truncate text-xs text-ink-muted">{currentFile}</p>
              </div>
              {onFileRemove && (
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="text-ink-muted hover:text-brand-red"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition',
              dragActive
                ? 'border-brand-sky bg-primary-50'
                : 'border-line-default hover:border-brand-sky hover:bg-surface-muted',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="space-y-2">
              {icon}
              <p className="text-sm font-medium text-ink-primary">Upload a new file</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition',
            dragActive
              ? 'border-brand-sky bg-primary-50'
              : 'border-line-default hover:border-brand-sky hover:bg-surface-muted',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="space-y-3">
            {icon}
            <p className="text-sm font-medium text-ink-primary">
              {placeholder || 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-ink-muted">
              {type === 'image' ? 'PNG, JPG up to 5MB' : 'PDF only up to 5MB'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-brand-red">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
