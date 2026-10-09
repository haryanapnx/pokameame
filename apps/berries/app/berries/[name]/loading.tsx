import { Container, Skeleton } from '@poke/ui'

export default function Loading() {
  return (
    <Container className="py-10">
      <Skeleton className="h-4 w-28" />

      <div className="mt-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-3 h-5 w-56" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>

      <Skeleton className="mt-8 h-44 w-full rounded-card" />
    </Container>
  )
}
