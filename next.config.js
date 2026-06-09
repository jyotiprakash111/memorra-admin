/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  // Suppress Next.js 16 transitional deprecation warnings
  // The middleware.ts convention still works but will be replaced with proxy in future versions
  onDemandEntries: {
    maxInactiveAge: 15 * 60 * 1000,
    pagesBufferLength: 5,
  },
}

export default nextConfig
