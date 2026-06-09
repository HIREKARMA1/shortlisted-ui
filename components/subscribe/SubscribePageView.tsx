'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle2, Shield } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { useStudentSubscribeGate } from '@/hooks/useSession';
import { startCheckout } from '@/lib/payments/checkout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

type BatchInfo = {
  seats_remaining?: number;
  subscription_amount_inr?: number;
};

const benefitKeys = ['batch', 'jobs', 'coordinator', 'dashboard'] as const;

export function SubscribePageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [paymentProvider, setPaymentProvider] = useState('payu');
  const { ready, session, accessStatus } = useStudentSubscribeGate();

  useEffect(() => {
    if (!ready || !session || accessStatus === 'active') return;
    api.getActiveBatch().then(setBatchInfo).catch(() => setBatchInfo(null));
    api.getPaymentConfig().then((cfg) => setPaymentProvider(cfg.provider)).catch(() => undefined);
  }, [ready, session, accessStatus]);

  useEffect(() => {
    const result = searchParams.get('payment');
    if (result === 'success') {
      toast.success(t('subscribe.success'));
      localStorage.setItem('access_status', 'active');
      router.replace('/dashboard/student');
    } else if (result === 'failed') {
      const message = searchParams.get('message');
      toast.error(message || t('common.errors.generic'));
      router.replace('/subscribe');
    }
  }, [router, searchParams, t]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const order = await api.createPaymentOrder();
      await startCheckout(order, async (payload) => {
        await api.verifyPayment(payload);
        toast.success(t('subscribe.success'));
        localStorage.setItem('access_status', 'active');
        router.push('/dashboard/student');
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        ((err as Error).message === 'payment_script_load_failed'
          ? t('common.errors.generic')
          : t('common.errors.generic'));
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const seatsFull = (batchInfo?.seats_remaining ?? 1) === 0;

  if (!ready || !session || accessStatus === 'active') {
    return null;
  }

  return (
    <AuthLayout title={t('subscribe.title')} subtitle={t('subscribe.subtitle')}>
      <div className="space-y-6">
        {batchInfo && (
          <div className="rounded-xl border border-line-default bg-surface-muted p-5 text-center">
            <Text variant="muted">{t('subscribe.seatsLabel')}</Text>
            <p className="mt-1 font-display text-4xl font-bold text-brand-sky">
              {batchInfo.seats_remaining ?? 0}
            </p>
            {batchInfo.subscription_amount_inr != null && (
              <p className="mt-3 text-lg font-semibold text-brand-blue">
                {t('subscribe.amountLabel')}:{' '}
                {t('subscribe.currency', { amount: batchInfo.subscription_amount_inr })}
              </p>
            )}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-ink-primary">{t('subscribe.benefits.title')}</p>
          <ul className="mt-3 space-y-2">
            {benefitKeys.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-ink-secondary">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                {t(`subscribe.benefits.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant="accent"
          fullWidth
          onClick={handleSubscribe}
          disabled={loading || seatsFull}
          className="py-3"
        >
          {loading ? t('subscribe.processing') : t('subscribe.cta')}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-ink-muted">
          <Shield className="h-3.5 w-3.5" />
          {t('subscribe.secure', { provider: paymentProvider.toUpperCase() })}
        </p>
      </div>
    </AuthLayout>
  );
}
