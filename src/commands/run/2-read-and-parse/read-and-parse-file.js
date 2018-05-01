// @flow

const AstNodeList = require('../../../parsers/ast-node-list.js')
const fs = require('fs-extra')
const parseMarkdown = require('../../../parsers/markdown/parse-markdown.js')

module.exports = async function (filename: string): Promise<AstNodeList> {
  const content = await fs.readFile(filename, { encoding: 'utf8' })
  return parseMarkdown(content, filename)
}
