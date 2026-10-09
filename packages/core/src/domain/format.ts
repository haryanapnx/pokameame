/** `mr-mime` → `Mr Mime`. Inverse of `slugify` / `normalizeEntityName`. */
export function displayName(name: string): string {
  return name
    .split('-')
    .map((part) => (part === '' ? '' : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ')
}

/** `25` → `#025`. Ids longer than the padding keep their digits. */
export function formatId(id: number, minDigits = 3): string {
  return `#${String(id).padStart(minDigits, '0')}`
}
