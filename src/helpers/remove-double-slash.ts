const doubleSlashRE = /\/+/g

// Replaces multiple occurrences of '/' with a single slash
export default function removeDoubleSlash(text: string): string {
  return text.replace(doubleSlashRE, '/')
}
