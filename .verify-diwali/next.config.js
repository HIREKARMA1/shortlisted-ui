/** @type {import('next').NextConfig} */
const apiOrigin = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

const nextConfig = {
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
