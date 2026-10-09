import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { displayName } from '@poke/core'
import { getBerryDetail } from '@poke/core/services'
import { Container } from '@poke/ui'

import { BerryDetail } from '../../../components/BerryDetail/BerryDetail'

type BerryDetailParams = Promise<{ name: string }>

type BerryDetailPageProps = {
  params: BerryDetailParams
}

export async function generateMetadata({ params }: BerryDetailPageProps): Promise<Metadata> {
  const { name } = await params
  const berry = await getBerryDetail(name)

  if (!berry) return { title: 'Berry not found' }

  const title = displayName(berry.name)

  return {
    title,
    description: `Properties, flavours and effects for ${title}.`,
  }
}

export default async function BerryDetailPage({ params }: BerryDetailPageProps) {
  const { name } = await params
  const berry = await getBerryDetail(name)

  if (!berry) notFound()

  return (
    <Container className="py-10">
      <Link
        prefetch={false}
        href="/berries"
        className="text-sm text-content-muted hover:text-content"
      >
        ← Back to berries
      </Link>

      <div className="mt-6">
        <BerryDetail berry={berry} />
      </div>
    </Container>
  )
}
