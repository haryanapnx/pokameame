/**PokeAPI stores height in decimetres. */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`
}

/**PokeAPI stores weight in hectograms. */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}
