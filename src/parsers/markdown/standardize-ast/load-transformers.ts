import { TransformerList } from '../standardize-ast/transformer-list'

import fs from 'fs-extra'
import path from 'path'
import isJsFile from '../../../helpers/is-js-file'

export default async function loadTransformers(
  type: string
): Promise<TransformerList> {
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
  const allFiles = await fs.readdir(dir)
  const jsFiles = allFiles.filter(isJsFile)
  for (const file of jsFiles) {
    const transformerPath = path.join(dir, file)
    const transformer = require(transformerPath).default
    result[path.basename(file, '.js')] = transformer
  }
  return result
}
