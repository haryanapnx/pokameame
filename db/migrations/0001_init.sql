-- 0001_init.sql — customPokemon and Berry tables.
-- Applied by `pnpm db:migrate`; never runs on cold start.

create table if not exists custom_pokemon (
  id serial primary key,
  name text not null unique,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists custom_berry (
  id serial primary key,
  name text not null unique,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists custom_pokemon_name_idx on custom_pokemon (name);
create index if not exists custom_berry_name_idx on custom_berry (name);
