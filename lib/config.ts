const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? 'v1';

if (!apiBaseUrl && typeof window !== 'undefined') {
  console.error('NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local');
}

export const config = {
  api: {
    baseUrl: apiBaseUrl,
    version: apiVersion,
    fullUrl: `${apiBaseUrl}/api/${apiVersion}`,
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME ?? 'Shortlisted',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
  },
  features: {
    devPaymentBypass: process.env.NEXT_PUBLIC_DEV_PAYMENT_BYPASS === 'true',
  },
} as const;
