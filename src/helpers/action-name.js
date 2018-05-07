// @flow

const kebabcase = require('just-kebab-case')
const path = require('path')

module.exports = function actionName (filepath: string): string {
  return kebabcase(path.basename(filepath, path.extname(filepath)))
}
