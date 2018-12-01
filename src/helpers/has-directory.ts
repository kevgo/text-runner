import fs from 'fs'

export default function hasDirectory(dirname: string): boolean {
  try {
    return fs.statSync(dirname).isDirectory()
  } catch (e) {
    return false
  }
}
