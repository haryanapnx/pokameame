import { Container, Grid, Skeleton } from '@poke/ui'

export default function Loading() {
  return (
    <Container className="py-10">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-80" />
      <Skeleton className="mt-6 h-10 w-full max-w-md" />

      <Grid columns={4} className="mt-6">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </Grid>
    </Container>
  )
}
