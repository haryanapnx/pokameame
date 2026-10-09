export type ZoneRoutes = {
  pokemon: string
  berries: string
}

export type ZoneRewrite = {
  source: string
  destination: string
}

/** Asset prefixes each zone uses (see their `assetPrefix`) so the shell can proxy their assets. */
export const ZONE_ASSET_PREFIXES = {
  pokemon: '/pokemon-static',
  berries: '/berries-static',
} as const

const DEFAULT_POKEMON_ZONE_URL = 'http://localhost:3001'
const DEFAULT_BERRIES_ZONE_URL = 'http://localhost:3002'

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

/**
 * Zone URLs must be origins: the rewrite table below appends `/pokemon` / `/berries` itself, so a value that already
 * carries the path would resolve to `/pokemon/pokemon`. Catch that at build time with a readable message instead of
 * shipping a 404.
 */
function normalizeZoneUrl(value: string, variable: string): string {
  const url = stripTrailingSlash(value)

  let pathname: string
  try {
    pathname = new URL(url).pathname
  } catch {
    throw new Error(`${variable} must be an absolute URL, e.g. https://pokemon.example.com`)
  }

  if (pathname !== '/' && pathname !== '') {
    throw new Error(
      `${variable} must be the zone's origin only — drop "${pathname}". ` +
        'The shell already appends /pokemon and /berries when it proxies.',
    )
  }

  return url
}

/** Resolves each zone's upstream URL, falling back to the local dev ports. */
export function resolveZoneRoutes(
  env: Record<string, string | undefined> = process.env,
): ZoneRoutes {
  return {
    pokemon: normalizeZoneUrl(env.POKEMON_ZONE_URL ?? DEFAULT_POKEMON_ZONE_URL, 'POKEMON_ZONE_URL'),
    berries: normalizeZoneUrl(env.BERRIES_ZONE_URL ?? DEFAULT_BERRIES_ZONE_URL, 'BERRIES_ZONE_URL'),
  }
}

/**
 * Builds the `rewrites()` entries that proxy each zone's route subtree, its Route Handlers
 * **and its static assets**. Without the asset rules a zone's CSS/JS would be requested from the
 * shell and 404; without the API rules the zones' React Query fetches would hit the shell and 404.
 */
export function buildZoneRewrites(zones: ZoneRoutes): ZoneRewrite[] {
  return [
    { source: '/pokemon', destination: `${zones.pokemon}/pokemon` },
    { source: '/pokemon/:path*', destination: `${zones.pokemon}/pokemon/:path*` },
    { source: '/berries', destination: `${zones.berries}/berries` },
    { source: '/berries/:path*', destination: `${zones.berries}/berries/:path*` },
    {
      source: '/api/pokemon/:path*',
      destination: `${zones.pokemon}/api/pokemon/:path*`,
    },
    {
      source: '/api/berries/:path*',
      destination: `${zones.berries}/api/berries/:path*`,
    },
    {
      source: `${ZONE_ASSET_PREFIXES.pokemon}/:path*`,
      destination: `${zones.pokemon}${ZONE_ASSET_PREFIXES.pokemon}/:path*`,
    },
    {
      source: `${ZONE_ASSET_PREFIXES.berries}/:path*`,
      destination: `${zones.berries}${ZONE_ASSET_PREFIXES.berries}/:path*`,
    },
  ]
}

/** Rewrites for the current environment, used by `next.config.ts`. */
export function createZoneRewrites(
  env: Record<string, string | undefined> = process.env,
): ZoneRewrite[] {
  return buildZoneRewrites(resolveZoneRoutes(env))
}
