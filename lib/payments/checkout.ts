export type PaymentProvider = 'payu' | 'dev';

export type CreateOrderResponse = {
  provider: PaymentProvider;
  order_id: string;
  amount: number;
  currency: string;
  payment_record_id: string;
  checkout: Record<string, unknown>;
};

type VerifyPayload = {
  order_id: string;
  payment_id: string;
  signature: string;
  status?: string;
};

type PayUCheckout = {
  mode: 'hosted_form';
  action_url: string;
  method: string;
  params: Record<string, string>;
};

function submitHostedForm(checkout: PayUCheckout) {
  const form = document.createElement('form');
  form.method = checkout.method || 'POST';
  form.action = checkout.action_url;
  form.style.display = 'none';

  Object.entries(checkout.params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export async function startCheckout(
  order: CreateOrderResponse,
  onVerify: (payload: VerifyPayload) => Promise<void>,
) {
  if (order.checkout.mode === 'dev_bypass') {
    await onVerify({
      order_id: order.order_id,
      payment_id: `dev_${Date.now()}`,
      signature: 'dev',
      status: 'success',
    });
    return;
  }

  if (order.checkout.mode === 'hosted_form') {
    submitHostedForm(order.checkout as PayUCheckout);
    return;
  }

  throw new Error('unsupported_checkout_mode');
}
