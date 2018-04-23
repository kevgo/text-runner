// @flow

import type { AstNodeList } from './ast-node-list.js'

const parseMarkdown = require('./parsers/markdown/parse-markdown.js')
const readFile = require('../../../helpers/read-file.js')

module.exports = async function (filename: string): Promise<AstNodeList> {
  const content = await readFile(filename)
  return parseMarkdown(content, filename)
}
