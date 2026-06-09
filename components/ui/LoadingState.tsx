import { useTranslation } from '@/lib/i18n/context';
import { Text } from './Text';

export function LoadingState() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Text variant="muted">{t('common.actions.loading')}</Text>
    </div>
  );
}
