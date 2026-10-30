/** @type {import('next').NextConfig} */
const defaultApiOrigin = process.env.NODE_ENV === 'production'
  ? 'https://api.shortlisted.hirekarma.in'
  : 'http://localhost:8001';
const apiOrigin = process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiOrigin;

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  transpilePackages: ['three-globe'],
  // Local/dev: if the browser posts to same-origin /api/*, forward to the FastAPI server.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
