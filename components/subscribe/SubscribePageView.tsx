'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { config } from '@/lib/config';
import { PageContainer } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Text } from '@/components/ui/Text';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type BatchInfo = {
  seats_remaining?: number;
  subscription_amount_inr?: number;
};

export function SubscribePageView() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    api.getActiveBatch().then(setBatchInfo).catch(() => setBatchInfo(null));
  }, [router]);

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const order = await api.createPaymentOrder();
      if (config.features.devPaymentBypass) {
        await api.verifyPayment({
          razorpay_order_id: order.order_id,
          razorpay_payment_id: `dev_${Date.now()}`,
          razorpay_signature: 'dev',
        });
        toast.success(t('subscribe.success'));
        localStorage.setItem('access_status', 'active');
        router.push('/dashboard/student');
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error(t('common.errors.generic'));
        return;
      }

      const rzp = new window.Razorpay({
        key: order.key_id || config.razorpay.keyId,
        amount: order.amount,
        currency: order.currency,
        name: t('subscribe.razorpay.name'),
        description: t('subscribe.razorpay.description'),
        order_id: order.order_id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          await api.verifyPayment(response);
          toast.success(t('subscribe.success'));
          localStorage.setItem('access_status', 'active');
          router.push('/dashboard/student');
        },
      });
      rzp.open();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-page">
      <PageContainer className="max-w-lg text-center">
        <div className="mb-6 flex justify-end">
          <div className="w-40">
            <LanguageSwitcher />
          </div>
        </div>
        <Text variant="title">{t('subscribe.title')}</Text>
        <Text variant="subtitle" className="mx-auto mt-3 max-w-md">
          {t('subscribe.subtitle')}
        </Text>
        {batchInfo && (
          <Card className="mx-auto mt-8 max-w-sm">
            <Text variant="muted">{t('subscribe.seatsLabel')}</Text>
            <p className="mt-2 font-display text-4xl font-bold text-primary-600">
              {batchInfo.seats_remaining ?? 0}
            </p>
            {batchInfo.subscription_amount_inr != null && (
              <Text variant="muted" className="mt-2">
                {t('subscribe.amountLabel')}: {t('subscribe.currency', { amount: batchInfo.subscription_amount_inr })}
              </Text>
            )}
          </Card>
        )}
        <Button onClick={handleSubscribe} disabled={loading} className="mt-8 px-8">
          {loading ? t('subscribe.processing') : t('subscribe.cta')}
        </Button>
      </PageContainer>
    </main>
  );
}
