import { redirect } from 'next/navigation'

/**
 * The zone only serves `/pokemon/*` — the shell owns `/`. Visiting the zone origin directly (debugging, a preview
 * deployment) lands on this page, so send it to the library instead of showing a 404.
 */
export default function PokemonZoneRootPage() {
  redirect('/pokemon')
}
