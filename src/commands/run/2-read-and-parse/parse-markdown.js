// @flow

const MarkdownParser = require('./parsers/markdown/markdown-parser.js')

const parser = new MarkdownParser()

module.exports = function (text: string, filepath: string) {
  return parser.parse(text, filepath)
}
