/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
    ],
  },
  // Configure body size limit for API routes and Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  // Also configure for API routes
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  }
}

module.exports = nextConfig