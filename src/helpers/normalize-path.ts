import path from 'path'

const normalizeRE = new RegExp('[\\\\/]+', 'g')

export default function(filepath: string): string {
  return filepath.replace(normalizeRE, path.sep)
}
