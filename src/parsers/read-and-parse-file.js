// @flow

const AstNodeList = require('../parsers/ast-node-list.js')
const { magenta } = require('chalk')
const fs = require('fs-extra')
const parseMarkdown = require('../parsers/markdown/parse-markdown.js')

module.exports = async function (filename: string): Promise<AstNodeList> {
  const content = (await fs.readFile(filename, { encoding: 'utf8' })).trim()
  if (content.length === 0) console.log(magenta('found empty file ' + filename))
  return parseMarkdown(content, filename)
}
