import { Container, Skeleton } from '@poke/ui'

export default function Loading() {
  return (
    <Container className="py-12">
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    </Container>
  )
}
