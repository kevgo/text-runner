export default function isAbsolutePath(filepath: string): boolean {
  return filepath.startsWith('/') || filepath.startsWith('\\')
}
