// @flow

const kebabCase = require('just-kebab-case')
const path = require('path')

module.exports = function actionName (filepath: string): string {
  return kebabCase(path.basename(filepath, path.extname(filepath)))
}
