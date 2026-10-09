import { Badge, Card, Container, Grid, buttonClasses } from '@poke/ui'

import berriesLibraryImage from './_assets/berries.webp'
import pokemonLibraryImage from './_assets/poke.webp'
import heroImg from './_assets/hero.webp'
import Image from 'next/image'

const LIBRARIES = [
  {
    href: '/pokemon',
    title: 'Pokemon Library',
    description:
      'Browse and search Pokemon, inspect their types, abilities and base stats — or add your own.',
    cta: 'Explore Pokemon',
    image: pokemonLibraryImage,
  },
  {
    href: '/berries',
    title: 'Berries Library',
    description: 'Explore berry firmness, flavours and related effects — or add your own.',
    cta: 'Browse Berries',
    image: berriesLibraryImage,
  },
] as const

export default function HomePage() {
  return (
    <Container className="py-10 sm:py-14 min-h-screen">
      <section className="relative isolate grid min-h-[340px] overflow-hidden rounded-card lg:grid-cols-2 lg:items-center">
        <Image
          src={heroImg}
          alt="Hero"
          fill
          priority
          className="object-cover object-[68%_center]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-brand-50 via-brand-50/95 to-brand-50/35 sm:to-brand-50/20"
        />

        <div className="relative z-10 max-w-xl p-6 sm:p-10">
          <Badge tone="brand">Pokemon Explorer</Badge>

          <h1 className="mt-4 text-3xl font-bold text-content sm:text-4xl lg:text-5xl">
            Explore the Pokemon universe
          </h1>

          <p className="mt-4 text-sm text-content-muted sm:text-base">
            Browse Pokemon and Berries from PokeAPI, and create custom entries that live alongside
            them.
          </p>
        </div>
      </section>

      <Grid columns={2} className="mt-6">
        {LIBRARIES.map((library) => (
          <Card key={library.href} className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Image
              src={library.image}
              alt=""
              priority
              sizes="(min-width: 640px) 128px, 100vw"
              className="aspect-video w-full shrink-0 rounded-card object-cover sm:size-32"
            />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{library.title}</h2>
              <p className="mt-2 text-sm text-content-muted">{library.description}</p>
              <a href={library.href} className={buttonClasses({ className: 'mt-4' })}>
                {library.cta} →
              </a>
            </div>
          </Card>
        ))}
      </Grid>
    </Container>
  )
}
