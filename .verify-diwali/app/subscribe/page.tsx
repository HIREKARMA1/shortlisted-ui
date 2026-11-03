import { Suspense } from 'react';
import { SubscribePageView } from '@/components/subscribe/SubscribePageView';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SubscribePageView />
    </Suspense>
  );
}
