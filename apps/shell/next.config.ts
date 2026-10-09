import type { NextConfig } from 'next'

import { createZoneRewrites } from './lib/zone-routes'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ['@poke/ui'],
  /**
   * Zone pages are served under this origin, but `next/image` always requests the optimizer at
   * `/_next/image` (it is not covered by a zone's `assetPrefix`). Without this the shell's
   * optimizer rejects the zones' remote images with `"url" parameter is not allowed`.
   */
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'raw.githubusercontent.com' }],
  },
  async rewrites() {
    return createZoneRewrites()
  },
}

export default nextConfig
