import { Inbox } from 'lucide-react';
import { Text } from './Text';

export function EmptyState({ message, title }: { message: string; title?: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line-default bg-surface-muted px-6 py-12 text-center">
      <div className="rounded-full bg-white p-3 shadow-card">
        <Inbox className="h-6 w-6 text-brand-sky" />
      </div>
      {title && <p className="mt-4 font-medium text-ink-primary">{title}</p>}
      <Text variant="muted" className="mt-2 max-w-sm">
        {message}
      </Text>
    </div>
  );
}
