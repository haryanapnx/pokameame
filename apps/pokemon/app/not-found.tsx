import Link from 'next/link'

import { Container, EmptyState, buttonClasses } from '@poke/ui'

export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        title="Pokemon not found"
        description="We could not find that Pokemon. It may have been removed, or the name is misspelled."
        action={
          <Link href="/pokemon" className={buttonClasses()}>
            Back to the list
          </Link>
        }
      />
    </Container>
  )
}
