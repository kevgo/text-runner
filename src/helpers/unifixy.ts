const re = /\\/g

// Converts the given Windows path into a Unix path
export default function unifixy(text: string): string {
  return text.replace(re, '/')
}
