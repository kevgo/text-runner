// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const AstNodeList = require('../parsers/ast-node-list.js')
const { magenta } = require('chalk')
const fs = require('fs-extra')
const parseMarkdown = require('../parsers/markdown/parse-markdown.js')

module.exports = async function (
  filename: AbsoluteFilePath
): Promise<AstNodeList> {
  const content = (await fs.readFile(filename.value, {
    encoding: 'utf8'
  })).trim()
  if (content.length === 0) {
    console.log(magenta('found empty file ' + filename.platformified()))
  }
  return parseMarkdown(content, filename)
}
