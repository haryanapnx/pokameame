import { Container, Skeleton } from '@poke/ui'

export default function Loading() {
  return (
    <Container className="py-10">
      <Skeleton className="h-4 w-32" />

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <Skeleton className="size-40 shrink-0 rounded-card" />

        <div className="flex-1">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-3 h-5 w-40" />
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-44 w-full rounded-card" />
        <Skeleton className="h-44 w-full rounded-card" />
      </div>
    </Container>
  )
}
