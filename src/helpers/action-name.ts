import kebabCase from 'just-kebab-case'
import path from 'path'

export default function actionName(filepath: string): string {
  return kebabCase(path.basename(filepath, path.extname(filepath)))
}
