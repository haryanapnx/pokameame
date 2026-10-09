# Architecture

How Pokemon Explorer is put together: the microfrontend topology, where data is fetched and cached, how custom
entries are stored, and which parts render on the server versus the client.

## 1. System overview

Three independently runnable Next.js apps behind **one origin**, plus two shared workspace packages.

```
                          ┌────────────────────────────────────────────────┐
   browser ──────────────▶│  shell  (dev :3000)                            │
   single origin,         │    /            home, layout, header, footer    │
   single session         │    rewrites()   proxies zone traffic            │
                          └───────┬───────────────────────────┬────────────┘
                                  │ /pokemon/*                │ /berries/*
                                  │ /api/pokemon/*            │ /api/berries/*
                                  │ /pokemon-static/*         │ /berries-static/*
                                  ▼                           ▼
                       ┌──────────────────────┐    ┌──────────────────────┐
                       │ pokemon  (:3001)     │    │ berries  (:3002)     │
                       │ list · detail · new  │    │ list · detail · new  │
                       │ Server Actions       │    │ Server Actions       │
                       └──────────┬───────────┘    └──────────┬───────────┘
                                  └───────────┬───────────────┘
                                              ▼
                              packages/core  (@poke/core, server-only)
                              cached services → PokeAPI · Postgres (Neon)

                              packages/ui    (@poke/ui, presentational)
                              Tailwind v4 tokens + primitives (server-safe
                              by default, 4 client primitives)
```

The browser only ever talks to the shell origin. Every cross-zone request passes through the shell's `rewrites()`.

## 2. Repository layout and dependency direction

| Workspace | Path | Responsibility |
|---|---|---|
| `@poke/shell` | `apps/shell` | Host app: `/`, global layout, header/nav, providers, error boundaries, zone rewrites |
| `@poke/pokemon` | `apps/pokemon` | Zone owning `/pokemon/*` |
| `@poke/berries` | `apps/berries` | Zone owning `/berries/*` |
| `@poke/core` | `packages/core` | Domain models, PokeAPI client, cached services, Postgres store, hooks, React Query layer |
| `@poke/ui` | `packages/ui` | Owned design system: `@theme` tokens, primitives, `cn()` |
| tooling | `packages/{tsconfig,eslint-config,vitest-config}` | Shared TS/ESLint/Vitest config |

Dependencies are **one-way and acyclic**: `ui` and `core` depend on nothing internal; zones depend on both; the shell
depends on `ui` only. **Zones never import each other**, and the shell never imports zone code — the integration is
purely URL-based. Build order: `ui` + `core` → `shell` → `pokemon` ‖ `berries`.

Local development runs the same three apps through `compose.yaml`: one container with the repository bind-mounted, plus
Postgres and a one-shot migration service, so a contributor needs nothing installed beyond Docker.

## 3. The multi-zone contract

`apps/shell/lib/zone-routes.ts` builds the rewrite table; `next.config.ts` hands it to `rewrites()`.

| Rule | Why it exists |
|---|---|
| `/pokemon/:path*` → `POKEMON_ZONE_URL/pokemon/:path*` (same for berries) | Route subtree proxying |
| `/api/pokemon/:path*`, `/api/berries/:path*` | The zones' Route Handlers back the autocomplete islands. Without this, a relative `fetch('/api/pokemon/search')` hits the shell and 404s |
| `/pokemon-static/:path*`, `/berries-static/:path*` | Each zone sets `assetPrefix`, so its CSS/JS lives under its own prefix. The shell must proxy those too, or every asset 404s under the shell origin |

Traps worth knowing (each one cost time here):

- **`assetPrefix` is mandatory per zone.** Without it a zone's `/_next/static/*` collides with the shell's own.
- **Cross-zone links must be plain `<a>`, not `next/link`.** Soft navigation between different Next apps is unsupported;
  a `<Link>` would try a client-side transition into a route tree the shell does not own. `SiteHeader` is server-rendered
  and uses anchors for exactly this reason.
- **Server Actions need `experimental.serverActions.allowedOrigins`.** The browser posts from the *shell's* origin to a
  zone's action endpoint, which is a different origin server-side.
- **`rewrites()` is evaluated at build time**, so `POKEMON_ZONE_URL` / `BERRIES_ZONE_URL` must be set when the shell is
  built. Changing them requires a rebuild, not just a restart.
- **`next/image` optimizes on the page origin.** `/_next/image` is *not* covered by a zone's `assetPrefix`, so the shell
  owns the optimizer and therefore needs `images.remotePatterns` for any remote host a zone renders (e.g.
  `raw.githubusercontent.com` for sprites).
- **A zone's `public/` is not reachable from the shell origin.** Files referenced by URL belong in `apps/shell/public/`
  or, better for component images, in a static import.
- **In the Docker dev stack all three apps share one container**, so the shell keeps `POKEMON_ZONE_URL` /
  `BERRIES_ZONE_URL` pointed at `http://localhost:3001` / `:3002`. No service-name rewrites are needed, and the
  container behaves exactly like `pnpm dev` on the host.

## 4. Rendering strategy

Everything renders on the server; only the smallest interactive leaf is a client component. `cacheComponents: true`
(Next 16 Cache Components / PPR) is enabled in all three apps.

| Route or section | Renders on | Notes |
|---|---|---|
| `/` (shell home) | Server | Static content; hero + library images are static imports (`next/image`, blur placeholder) |
| `/pokemon`, `/berries` lists | Server | `searchParams` awaited, then passed as **arguments** into cached services |
| List cards, type badges | Server | No client JS per card |
| Pagination | Server | Anchors with `prefetch`; URLs shareable, no client hook needed |
| `/pokemon/[name]`, `/berries/[name]` | Server | `generateMetadata` + detail blocks; `loading.tsx` provides the Suspense boundary |
| Type matchups / abilities / stats | Server | Derived from the cached `/type` and `/ability` reads |
| `/pokemon/new`, `/berries/new` | Server shell + Client form | Form posts to a Server Action (`useActionState`, `useFormStatus`) |
| Search inputs | **Client island** | Debounced; writes `?q=` inside `useTransition`; autocomplete via React Query |
| `Dialog`, `Tabs`, `MobileMenu`, `SubmitButton` | **Client** | The only `'use client'` files in `@poke/ui` |
| `apps/shell/app/error.tsx` | **Client** | Next requires error boundaries to be client components |

**List state is the URL** (`?page=`, `?q=`), which keeps results shareable, prefetchable, and lets the server cache its
work per page/query combination. The search inputs never own the list state — they only sync the URL.

## 5. Data flow

**1. Browsing a list** (`/pokemon?page=2&q=pika`)

```
zone page (server)                @poke/core (server-only)
  await searchParams      ──▶     listPokemonCatalog({ page, query })   'use cache' + cacheLife('minutes') + cacheTag('pokemon')
                                    ├─ getPokemonIndex()                cached name index (1h TTL)
                                    ├─ customPokemonRepository.list()   Neon rows
                                    ├─ filterCatalog / selectCatalogPage pure, unit-tested
                                    └─ mapWithConcurrency(items, 8)     per-type fetches for the visible page
  <PokemonGrid> (server)  ◀──     Paginated<PokemonSummary>
```

**2. Autocomplete in the search box**

```
client island ──▶ React Query ──▶ GET /api/pokemon/search?q=   (Route Handler, limit clamped 1–20)
                                        └─▶ cached service reads the 1h name index — no detail fetches
```

The Route Handler exists because the island fetches from the browser; the server cache stays authoritative and the
list itself is still server-rendered.

**3. Creating a custom entry**

```
AddPokemonForm (client, useActionState)
      │  FormData
      ▼
createPokemonAction   ('use server', apps/pokemon/app/pokemon/actions.ts)
      │
      ├─▶ saveCustomPokemon(input)   validate → reject duplicates → insert (never throws)
      ├─▶ updateTag('pokemon') + updateTag('pokemon:<name>')   read-your-writes
      └─▶ redirect(`/pokemon/<name>`)
```

Mutations are Server Actions rather than `useMutation` so the form keeps working without JavaScript. The same shape is
used for berries (`updateTag('berries')`, `updateTag('berries:<name>')`).

## 6. Caching (Next 16 Cache Components)

Caching is opt-in per function with the stable `use cache` directive. Profiles and tags live in
`packages/core/src/data/cache.ts` so services and Server Actions agree on the same strings.

| `cacheLife` profile | Used for | TTL intent |
|---|---|---|
| `index` → `'hours'` | The full Pokemon/Berry name index backing search | **1 hour** (the agreed TTL) |
| `list` → `'minutes'` | List pages | Short-lived |
| `detail` → `'max'` | Detail entries, ability/type lookups | Long-lived |

| Tag | Scope |
|---|---|
| `pokemon`, `berries` | Whole collection (list + everything derived from it) |
| `pokemon:<name>`, `berries:<name>` | One detail entry |
| `pokemon-index`, `berry-index` | The search index |
| `ability:<name>`, `type:<name>` | Detail extras fetched from `/ability` and `/type` |

Invalidation: Server Actions call **`updateTag(...)`** so the writer immediately sees its own write. Outside a request
that needs read-your-writes, `revalidateTag(tag, 'max')` is the stale-while-revalidate alternative (Next 16 requires the
`cacheLife` profile argument).

Rules the cached functions must follow (they are constraints of the directive, not preferences):

- A cached function **cannot read `searchParams`, `cookies` or `headers`** — `page`/`q` are passed in as arguments and
  become part of the cache key.
- Cached orchestrators only call imports (that is why the raw readers live in their own modules, e.g.
  `pokemon-reads.ts`, `ability-reads.ts`).
- Anything that talks to the network or the database is marked `import 'server-only'`.

## 7. Custom entry store

PokeAPI has no write endpoint, so custom entries are stored in **PostgreSQL** (Neon serverless, free tier) and merged
with upstream data at read time.

```
db/migrations/0001_init.sql
  custom_pokemon (id, name text not null unique, payload jsonb, created_at timestamptz)
  custom_berry   (id, name text not null unique, payload jsonb, created_at timestamptz)
  + named indexes on name
```

- **Migrations are explicit, never run on cold start:** `pnpm db:migrate` (root script, `--env-file-if-exists=.env`)
  applies `db/migrations/*.sql` idempotently with a small pool. In deployment it is a CI / pre-deploy step.
- **Access is behind interfaces.** Repositories take a `Queryable` (`packages/core/src/data/custom/queryable.ts`), so
  they are testable without a live database and the `pg` pool is the only adapter.
- **The connection string is normalised.** `resolveConnectionString()` rewrites `sslmode=prefer|require|verify-ca` to
  `verify-full`, keeping today's strict TLS behaviour under the libpq semantics coming in pg v9. Use the Neon **pooled**
  endpoint (host contains `-pooler`) since serverless creates many short-lived clients.
- **Merge semantics:** custom entries override an upstream entry with the same name; the catalogue merges by name and
  flags each row with `origin: 'pokeapi' | 'custom'`, which drives the "Custom" badge in the UI.
- **Custom entries are global shared records.** Authentication, ownership and per-user collections are intentionally out
  of scope for this build.

## 8. Testing strategy

Unit and component tests only — no E2E — run with Vitest and Testing Library.

| Scope | How |
|---|---|
| Pure logic (pagination math, mappers/schemas, validation, matchup maths, formatters, hooks, components) | Unit / RTL tests |
| Anything with `'use cache'` + database access | Verified at runtime against a real Postgres, because it needs the Next runtime and a pool singleton |

Two configuration details make the suite work in this monorepo:

- `@poke/vitest-config` forces `NODE_ENV=test` (the shell environment exports `NODE_ENV=production`, which loaded
  React's production build and removed `act`).
- `server-only` is aliased to an empty module in tests; the guard still applies to real builds.

Packages with Testing Library tests must declare `@testing-library/react`, `@testing-library/jest-dom` and `jsdom` as
**direct** devDependencies, because pnpm's strict linking does not hoist them.

## 9. Conventions

- **Components:** `components/<Name>/<Name>.tsx` beside `<Name>.test.tsx`, PascalCase, folder named after the component.
  Non-component modules sit at the package `src` root.
- **Server by default:** add `'use client'` only to the smallest interactive leaf, and `import 'server-only'` in every
  module that touches the network or the database.
- **Tailwind v4 tokens ship as CSS.** Every app must `@import 'tailwindcss'`, `@import '@poke/ui/theme.css'` and
  `@source` the package source, or the design-system classes silently disappear from the build.
- **No third-party UI component libraries** — primitives are hand-built on Tailwind.

## 10. Local development gotchas

- **Ports:** the shell takes 3000 and the zones 3001/3002. A second `pnpm dev` while the first is running fails.
- **Editing `packages/ui` invalidates running dev clients.** Turbopack renames the package's chunk, so a browser tab
  that was already open can fail with `client reference proxy ... module factory is not available` (and a failed
  "validate instant UI"). Hard-reload the tab; restart the dev server if it persists.
- **Zone URLs are baked in at build time** — a stale `POKEMON_ZONE_URL` shows up as a 404 or a proxy error only after a
  rebuild.
- **Detail routes need a Suspense boundary.** In Next 16, accessing `params` outside `<Suspense>` logs "encountered URL
  data during prerendering"; each detail segment ships a `loading.tsx` that provides it.
- **Docker / Compose:** ports 3000-3002 plus **55432** (the container Postgres) must be free. Dependencies live in the
  image rather than on the host, so after a dependency change run
  `docker compose build && docker compose up --renew-anon-volumes`. File watching across the bind mount is verified
  working: new files are picked up without restarting the container.
