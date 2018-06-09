// @flow

const AstNodeList = require('../ast-node-list.js')
const AstStandardizer = require('./standardize-ast/ast-standardizer.js')
// $FlowFixMe
const Remarkable = require('remarkable')

const markdownParser = new Remarkable('full', { html: true })

// Parses Markdown files into an AstNode[]
async function parseMarkdown (
  markdownText: string,
  filepath: string
): Promise<AstNodeList> {
  const raw = markdownParser.parse(markdownText, {})
  const astStandardizer = new AstStandardizer(filepath)
  return astStandardizer.standardize(raw)
}

module.exports = parseMarkdown
