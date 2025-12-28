import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
   experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
