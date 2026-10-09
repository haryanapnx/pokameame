import Link from 'next/link'

import { Container, EmptyState, buttonClasses } from '@poke/ui'

export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        title="Berry not found"
        description="We could not find that berry. It may have been removed, or the name is misspelled."
        action={
          <Link href="/berries" className={buttonClasses()}>
            Back to the list
          </Link>
        }
      />
    </Container>
  )
}
