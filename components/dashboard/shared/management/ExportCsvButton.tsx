'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type ExportCsvButtonProps = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function ExportCsvButton({ label, loading, disabled, onClick }: ExportCsvButtonProps) {
  return (
    <Button
      type="button"
      variant="accent"
      onClick={onClick}
      disabled={disabled || loading}
      className="normal-case tracking-normal"
    >
      <Download className="mr-2 h-4 w-4" />
      {loading ? 'Exporting...' : label}
    </Button>
  );
}
