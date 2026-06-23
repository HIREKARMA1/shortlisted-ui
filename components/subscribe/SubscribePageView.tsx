'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle2, Mail, Phone, Shield } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { useStudentSubscribeGate } from '@/hooks/useSession';
import { startCheckout } from '@/lib/payments/checkout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

type BatchInfo = {
  seats_remaining?: number;
  subscription_amount_inr?: number;
};

type PaymentConfig = {
  provider: string;
  amount_inr: number;
  sales_contact_email?: string;
  sales_contact_phone?: string;
};

type PaymentMode = 'online' | 'offline';

const benefitKeys = ['batch', 'jobs', 'coordinator', 'dashboard'] as const;

export function SubscribePageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('online');
  const { ready, session, accessStatus } = useStudentSubscribeGate();

  useEffect(() => {
    if (!ready || !session || accessStatus === 'active') return;
    api.getActiveBatch().then(setBatchInfo).catch(() => setBatchInfo(null));
    api.getPaymentConfig().then(setPaymentConfig).catch(() => setPaymentConfig(null));
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
      toast.loading(t('subscribe.redirecting'), { id: 'payu-redirect' });
      startCheckout(order);
    } catch (err: unknown) {
      toast.dismiss('payu-redirect');
      const msg =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail || t('common.errors.generic');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const seatsFull = (batchInfo?.seats_remaining ?? 1) === 0;
  const amountInr =
    batchInfo?.subscription_amount_inr ?? paymentConfig?.amount_inr ?? null;
  const provider = paymentConfig?.provider ?? 'payu';

  if (!ready || !session || accessStatus === 'active') {
    return null;
  }

  return (
    <AuthLayout title={t('subscribe.title')} subtitle={t('subscribe.subtitle')}>
      <div className="space-y-6">
        {(batchInfo || amountInr != null) && (
          <div className="rounded-xl border border-line-default bg-surface-muted p-5 text-center">
            <Text variant="muted">{t('subscribe.amountLabel')}</Text>
            <p className="mt-1 font-display text-4xl font-bold text-brand-sky">
              {amountInr != null ? t('subscribe.currency', { amount: amountInr }) : '—'}
            </p>
            {batchInfo && (
              <p className="mt-3 text-lg font-semibold text-brand-blue">
                {t('subscribe.seatsLabel')}: {batchInfo.seats_remaining ?? 0}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line-default bg-surface-muted p-1">
          {(['online', 'offline'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPaymentMode(mode)}
              className={cn(
                'rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                paymentMode === mode
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-ink-muted hover:text-ink-primary',
              )}
            >
              {t(`subscribe.paymentMode.${mode}`)}
            </button>
          ))}
        </div>

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

        {paymentMode === 'online' ? (
          <>
            <Button
              variant="accent"
              fullWidth
              onClick={handleSubscribe}
              disabled={loading || seatsFull}
              className="py-3"
            >
              {loading ? t('subscribe.processing') : t('subscribe.ctaOnline')}
            </Button>
            <p className="flex items-center justify-center gap-2 text-xs text-ink-muted">
              <Shield className="h-3.5 w-3.5" />
              {t('subscribe.secure', { provider: provider.toUpperCase() })}
            </p>
          </>
        ) : (
          <div className="space-y-4 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-5">
            <p className="text-sm text-ink-secondary">{t('subscribe.offline.description')}</p>
            <ul className="space-y-2 text-sm text-ink-primary">
              {paymentConfig?.sales_contact_phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-orange" />
                  <a
                    href={`tel:${paymentConfig.sales_contact_phone}`}
                    className="font-medium link-brand"
                  >
                    {paymentConfig.sales_contact_phone}
                  </a>
                </li>
              )}
              {paymentConfig?.sales_contact_email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-orange" />
                  <a
                    href={`mailto:${paymentConfig.sales_contact_email}`}
                    className="font-medium link-brand"
                  >
                    {paymentConfig.sales_contact_email}
                  </a>
                </li>
              )}
            </ul>
            <p className="text-xs text-ink-muted">{t('subscribe.offline.note')}</p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
