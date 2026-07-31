const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001').replace(/\/$/, '');
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? 'v1';

export const config = {
  api: {
    baseUrl: apiBaseUrl,
    version: apiVersion,
    // Absolute FastAPI origin (preferred). next.config.js also rewrites /api/* as a fallback.
    fullUrl: `${apiBaseUrl}/api/${apiVersion}`,
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME ?? 'Shortlisted',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
  },
  contact: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '',
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'info@hirekarma.in',
  },
} as const;
