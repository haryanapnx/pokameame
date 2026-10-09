/** Minimal database surface the repositories depend on (satisfied by `pg` and `pg-mem`). */
export type QueryResult<Row = Record<string, unknown>> = {
  rows: Row[]
  rowCount: number | null
}

export type Queryable = {
  query<Row = Record<string, unknown>>(
    text: string,
    params?: readonly unknown[],
  ): Promise<QueryResult<Row>>
}
