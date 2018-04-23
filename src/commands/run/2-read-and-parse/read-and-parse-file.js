// @flow

const parseMarkdown = require('./parse-markdown.js')
const readFile = require('./read-file.js')

module.exports = async function (filename: string) {
  const content = await readFile(filename)
  return parseMarkdown(content, filename)
}
