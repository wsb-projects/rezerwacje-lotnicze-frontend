export function capitalize(text: string | undefined): string {
  if (text === undefined) return ''
  return text
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
