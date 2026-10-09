import { buildZoneRewrites, createZoneRewrites, resolveZoneRoutes } from './zone-routes'

describe('resolveZoneRoutes', () => {
  it('falls back to the local dev ports', () => {
    expect(resolveZoneRoutes({})).toEqual({
      pokemon: 'http://localhost:3001',
      berries: 'http://localhost:3002',
    })
  })

  it('honours the configured zone URLs', () => {
    expect(
      resolveZoneRoutes({
        POKEMON_ZONE_URL: 'https://pokemon.example',
        BERRIES_ZONE_URL: 'https://berries.example',
      }),
    ).toEqual({ pokemon: 'https://pokemon.example', berries: 'https://berries.example' })
  })

  it('strips trailing slashes', () => {
    expect(resolveZoneRoutes({ POKEMON_ZONE_URL: 'https://pokemon.example///' })).toMatchObject({
      pokemon: 'https://pokemon.example',
    })
  })

  it('rejects a zone URL that already contains the zone path', () => {
    expect(() =>
      resolveZoneRoutes({ POKEMON_ZONE_URL: 'https://pokemon.example/pokemon' }),
    ).toThrow(/POKEMON_ZONE_URL must be the zone's origin only/)
    expect(() =>
      resolveZoneRoutes({ BERRIES_ZONE_URL: 'https://berries.example/berries/' }),
    ).toThrow(/BERRIES_ZONE_URL must be the zone's origin only/)
  })

  it('rejects a zone URL without a protocol', () => {
    expect(() => resolveZoneRoutes({ POKEMON_ZONE_URL: 'pokemon.example' })).toThrow(
      /must be an absolute URL/,
    )
  })
})

describe('buildZoneRewrites', () => {
  it('maps each zone subtree, its API and its static assets to the upstream URL', () => {
    expect(
      buildZoneRewrites({ pokemon: 'http://localhost:3001', berries: 'http://localhost:3002' }),
    ).toEqual([
      { source: '/pokemon', destination: 'http://localhost:3001/pokemon' },
      { source: '/pokemon/:path*', destination: 'http://localhost:3001/pokemon/:path*' },
      { source: '/berries', destination: 'http://localhost:3002/berries' },
      { source: '/berries/:path*', destination: 'http://localhost:3002/berries/:path*' },
      { source: '/api/pokemon/:path*', destination: 'http://localhost:3001/api/pokemon/:path*' },
      { source: '/api/berries/:path*', destination: 'http://localhost:3002/api/berries/:path*' },
      {
        source: '/pokemon-static/:path*',
        destination: 'http://localhost:3001/pokemon-static/:path*',
      },
      {
        source: '/berries-static/:path*',
        destination: 'http://localhost:3002/berries-static/:path*',
      },
    ])
  })
})

describe('createZoneRewrites', () => {
  it('uses the environment when present', () => {
    const rewrites = createZoneRewrites({ POKEMON_ZONE_URL: 'https://poke.example' })

    expect(rewrites).toEqual(
      expect.arrayContaining([
        { source: '/pokemon/:path*', destination: 'https://poke.example/pokemon/:path*' },
        {
          source: '/api/pokemon/:path*',
          destination: 'https://poke.example/api/pokemon/:path*',
        },
        {
          source: '/pokemon-static/:path*',
          destination: 'https://poke.example/pokemon-static/:path*',
        },
      ]),
    )
  })
})
