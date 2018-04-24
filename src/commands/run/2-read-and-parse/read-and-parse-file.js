// @flow

import type { AstNodeList } from './ast-node-list.js'

const readFile = require('../../../helpers/read-file.js')
const MarkdownParser = require('./parsers/markdown/markdown-parser.js')

module.exports = async function (filename: string): Promise<AstNodeList> {
  const content = await readFile(filename)
  const parser = new MarkdownParser()
  return parser.parse(content, filename)
}
