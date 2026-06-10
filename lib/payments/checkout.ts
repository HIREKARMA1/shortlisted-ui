export type PaymentProvider = 'payu';

export type CreateOrderResponse = {
  provider: PaymentProvider;
  order_id: string;
  amount: number;
  currency: string;
  payment_record_id: string;
  checkout: Record<string, unknown>;
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

/** Redirects the browser to the PayU hosted checkout page. */
export function startCheckout(order: CreateOrderResponse): void {
  if (order.checkout.mode !== 'hosted_form') {
    throw new Error('unsupported_checkout_mode');
  }
  submitHostedForm(order.checkout as PayUCheckout);
}
