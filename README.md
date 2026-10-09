# Pokemon Explorer

Browse and search **Pokemon** and **Berries** from [PokeAPI](https://pokeapi.co), inspect their details, and **create
your own custom entries** that live alongside the upstream ones (PokeAPI has no write endpoint, so custom entries are
stored in Postgres).

Built as a **multi-zone microfrontend**: three independently runnable Next.js apps behind one origin, plus two shared
workspace packages (design system and domain layer).

- **Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · pnpm workspaces +
  Turborepo · Neon serverless PostgreSQL (`pg`) · TanStack Query (autocomplete only) · Vitest + Testing Library.
- **No third-party UI component libraries** — every primitive is hand-built on Tailwind.

## Quick start (Docker — recommended)

Only Docker is required: no Node, no pnpm, no Postgres, no Neon account.

```bash
pnpm docker:up        # or: docker compose up
```

Open **http://localhost:3000**. The shell serves the home page and proxies both zone subtrees, so every library is
reachable from the same origin (the zones are published directly on 3001 / 3002 as well, for debugging):

| URL | Served by | Port |
|---|---|---|
| `/` | shell | 3000 |
| `/pokemon`, `/pokemon/[name]`, `/pokemon/new` | pokemon zone | 3001 |
| `/berries`, `/berries/[name]`, `/berries/new` | berries zone | 3002 |

What the stack does: builds an image with every dependency already installed (`Dockerfile.dev`), starts Postgres 17 on
host port **55432** (so a local Postgres on 5432 stays untouched), applies the migrations once, then runs all three apps
through Turbo in one container — the same `pnpm dev` you would run by hand. The first run builds the image, so expect a
few minutes; later runs start in seconds.

- **Editing code:** the repository is bind-mounted, so changes are picked up without rebuilding. Rebuild only after a
  dependency change: `docker compose build && docker compose up --renew-anon-volumes`.
- **Using your own database (e.g. Neon):** override `DATABASE_URL` on the `migrate` and `dev` services (a `.env.docker`
  file works too), then `docker compose up` again.
- **Reset / stop:** `pnpm docker:reset` stops everything and drops the database volume; `pnpm docker:down` keeps it.
- If file watching ever misbehaves on macOS, `docker compose restart dev` picks the changes up.

## Running without Docker

Install the toolchain instead and run the same three apps straight on the host (URLs as in the table above):

| Requirement | Notes |
|---|---|
| Node.js ≥ 20.9 | `node -v` |
| pnpm 12 | `corepack enable` (reads `packageManager` from `package.json`), or `npm i -g pnpm@12` |
| PostgreSQL (optional) | Only needed for custom entries. Any Postgres works — including the container from the section above, at `postgresql://pokemon:pokemon@localhost:55432/pokemon` |

```bash
pnpm install

# 1. Configure env (see "Environment variables" below)
cp .env.example .env                      # used by the migrate script
cp .env.example apps/shell/.env.local     # POKEMON_ZONE_URL, BERRIES_ZONE_URL
cp .env.example apps/pokemon/.env.local   # DATABASE_URL, POKEAPI_BASE_URL
cp .env.example apps/berries/.env.local   # DATABASE_URL, POKEAPI_BASE_URL

# 2. Create the custom-entry tables (idempotent; needs DATABASE_URL in ./.env)
pnpm db:migrate

# 3. Run every app at once
pnpm dev
```

### Running a single app

Every app is independently runnable (useful for focused work or for reproducing a zone without the shell):

```bash
pnpm --filter @poke/shell dev
pnpm --filter @poke/pokemon dev
pnpm --filter @poke/berries dev
```

Opening a zone directly on `http://localhost:3001` works, but cross-zone links and the shared header expect the shell
origin — use `http://localhost:3000` for anything that navigates between libraries.

## Environment variables

All variables are documented with commentary in [`.env.example`](./.env.example). Next.js loads `.env.local` from each
app's own directory, which is why the example is copied into the app that needs it. The Docker stack needs no copying:
`compose.yaml` supplies these values to the containers.

| Variable | Used by | Purpose |
|---|---|---|
| `POKEMON_ZONE_URL` | shell | Upstream URL of the pokemon zone (`http://localhost:3001` in dev) |
| `BERRIES_ZONE_URL` | shell | Upstream URL of the berries zone (`http://localhost:3002` in dev) |
| `DATABASE_URL` | pokemon, berries (via `@poke/core`) | Postgres connection string — Neon **pooled** host, `sslmode=require` |
| `POKEAPI_BASE_URL` | `@poke/core` | Optional override; defaults to `https://pokeapi.co/api/v2` |
| `SHELL_ORIGIN` | pokemon, berries | Origin allowed to post Server Actions; defaults to `localhost:3000` |

`POKEMON_ZONE_URL` and `BERRIES_ZONE_URL` are read at **build** time (Next evaluates `rewrites()` during the build), so
they must be set before `pnpm build` in any deployed environment.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Runs all three apps (shell, pokemon, berries) with Turbopack |
| `pnpm build` | Production build of every app and package |
| `pnpm test` | Unit + component tests (Vitest) across the workspace |
| `pnpm test:coverage` | Same, with v8 coverage |
| `pnpm typecheck` | `tsc --noEmit` per workspace |
| `pnpm lint` | ESLint (flat config) per workspace |
| `pnpm format` / `pnpm format:check` | Prettier write / verify |
| `pnpm db:migrate` | Applies `db/migrations/*.sql` (idempotent). Reads `./.env` |

## Project structure

```
apps/
  shell/          # host app: layout, header/nav, zone rewrites, providers, error boundaries
  pokemon/        # /pokemon/* zone: list + search + pagination, detail, add-custom
  berries/        # /berries/* zone: same, for berries
packages/
  ui/             # @poke/ui  — Tailwind v4 @theme tokens + hand-built primitives
  core/           # @poke/core — domain, PokeAPI client, cached services, Neon store, hooks
  tsconfig/ eslint-config/ vitest-config/   # shared tooling configs
db/migrations/    # SQL migrations (custom_pokemon, custom_berry)
Dockerfile.dev    # dev image: Node 22 + pnpm 12 with every dependency preinstalled
compose.yaml      # local dev stack: Postgres + migrations + all three apps
```

## How it fits together (short version)

- The **shell** owns `/` and proxies `/pokemon/*`, `/berries/*`, each zone's Route Handlers and each zone's static
  assets. Zones never import each other, and the shell never imports zone code — integration is URL-based only.
- **`@poke/core`** is the only place that talks to PokeAPI or Postgres. Its read functions are cached with Next 16
  Cache Components (`'use cache'` + `cacheLife` + `cacheTag`); Server Actions call `updateTag()` for read-your-writes.
- Everything renders on the **server**. Only the smallest interactive leaves are client components: the two search
  inputs, the two add-custom forms, and the interactive UI primitives (`Dialog`, `Tabs`, `MobileMenu`, `SubmitButton`).
- List state (page, query) lives in the **URL**, so every list view is shareable, prefetchable and server-rendered.

## Deploying

Three **ordinary** Vercel projects (shell, pokemon, berries) plus a Neon database. They are composed with Next.js
multi-zone `rewrites()` — not Vercel's Microfrontends product — so all three fit the free Hobby plan:

1. Set `POKEMON_ZONE_URL` / `BERRIES_ZONE_URL` in the **shell** project to the deployed zone URLs (they are baked in at
   build time), and `SHELL_ORIGIN` in both zones to the shell's origin.
2. Set the Neon **pooled** `DATABASE_URL` in both zone projects.
3. Run `pnpm db:migrate` as a pre-deploy step — never on cold start.

## Tests

Unit and component tests only (no E2E), by design:

```bash
pnpm test          # all workspaces
pnpm --filter @poke/core test
```

Pure logic (pagination math, mappers, validation, matchups, hooks, components) is unit-tested. Functions that need the
Next runtime (anything with `'use cache'`) plus database access are verified at runtime against a real Postgres instead.
