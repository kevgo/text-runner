import kebabCase from 'just-kebab-case'
import path from 'path'

export function getActionName(filepath: string): string {
  return kebabCase(path.basename(filepath, path.extname(filepath)))
}
