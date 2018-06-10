// @flow

import type { TransformerList } from '../standardize-ast/transformer-list.js'

const fs = require('fs-extra')
const path = require('path')

module.exports = function loadTransformers (type: string): TransformerList {
  const result = {}
  const dir = path.join(__dirname, `transformers-${type}`)
  const files = fs.readdirSync(dir)
  for (let file of files) {
    const transformer = require(path.join(dir, file))
    result[path.basename(file, '.js')] = transformer
  }
  return result
}
