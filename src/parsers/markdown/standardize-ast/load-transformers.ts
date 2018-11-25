import { TransformerList } from '../standardize-ast/transformer-list'

import fs from 'fs-extra'
import path from 'path'
import isJsFile from '../../../helpers/is-js-file'

export default function loadTransformers(type: string): TransformerList {
  const result = {}
  const dir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'dist',
    'parsers',
    'markdown',
    'standardize-ast',
    `transformers-${type}`
  )
  const files = fs.readdirSync(dir).filter(isJsFile)
  for (const file of files) {
    const transformerPath = path.join(dir, file)
    const transformer = require(transformerPath).default
    result[path.basename(file, '.js')] = transformer
  }
  return result
}
