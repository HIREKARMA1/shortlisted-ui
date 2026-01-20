/**
 * Application configuration
 * Centralized configuration for the application
 */

export const config = {
  app: {
    name: "Shortlisted",
    description: "Modern platform built with Next.js, TypeScript, and Tailwind CSS",
    version: "0.1.0",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    version: process.env.NEXT_PUBLIC_API_VERSION || "v1",
    timeout: 30000, // 30 seconds
  },
  features: {
    darkMode: true,
    analytics: false,
  },
} as const;

