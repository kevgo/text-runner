const doubleSlashRE = /\/+/g

// Replaces multiple occurrences of '/' with a single slash
export function removeDoubleSlash(text: string): string {
  return text.replace(doubleSlashRE, '/')
}
