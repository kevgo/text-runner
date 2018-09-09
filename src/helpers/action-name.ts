import kebabCase from 'just-kebab-case'
import path from 'path'

module.exports = function actionName(filepath: string): string {
  return kebabCase(path.basename(filepath, path.extname(filepath)))
}
