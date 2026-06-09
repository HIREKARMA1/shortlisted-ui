import { Text } from './Text';

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line-default bg-surface-muted px-4 py-8 text-center">
      <Text variant="muted">{message}</Text>
    </div>
  );
}
