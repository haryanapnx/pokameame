'use client'

import { Button, Container, ErrorState } from '@poke/ui'

/** Client Component — Next requires error boundaries to be client-side. */
export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Container className="py-12">
      <ErrorState
        title="Something went wrong"
        description="We could not load this page. Please try again."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </Container>
  )
}
