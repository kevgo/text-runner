export function addLeadingSlash(filepath: string): string {
  if (filepath[0] === '/') {
    return filepath
  } else {
    return '/' + filepath
  }
}
