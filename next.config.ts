// biome-ignore assist/source/organizeImports: <explanation>
import type { NextConfig } from 'next'
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const path = require('path')
const nextConfig: NextConfig = {
  cacheComponents: true,
  /* config options here */
  reactCompiler: true,
    turbopack: {
    root: path.join(__dirname, '..'),
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
