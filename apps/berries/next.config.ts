import type { NextConfig } from 'next'

const ZONE_ASSET_PREFIX = '/berries-static'

function zoneHost(): string {
  const configured = process.env.BERRIES_ZONE_URL
  if (configured) {
    try {
      return new URL(configured).host
    } catch {
      /* fall through to the dev default */
    }
  }
  return 'localhost:3002'
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Multi-zone: keep this zone's static assets out of the shell's own /_next namespace.
  assetPrefix: ZONE_ASSET_PREFIX,
  transpilePackages: ['@poke/core', '@poke/ui'],
  experimental: {
    // Server Actions post from the shell's origin, so it must be explicitly allowed.
    serverActions: {
      allowedOrigins: [process.env.SHELL_ORIGIN ?? 'localhost:3000', zoneHost()],
    },
  },
}

export default nextConfig
