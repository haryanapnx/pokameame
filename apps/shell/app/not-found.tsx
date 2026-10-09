import Link from 'next/link'

import { Container, EmptyState, buttonClasses } from '@poke/ui'

export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist."
        action={
          <Link href="/" className={buttonClasses()}>
            Back to home
          </Link>
        }
      />
    </Container>
  )
}
