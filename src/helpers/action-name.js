// @flow

const dashify = require('dashify')
const path = require('path')

module.exports = function actionName (filepath: string): string {
  return dashify(path.basename(filepath, path.extname(filepath)))
}
