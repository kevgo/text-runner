// @flow

const fs = require('fs')
const path = require('path')

module.exports = function isMarkdownFile (filename: string): boolean {
  try {
    const filepath = path.join(process.cwd(), filename)
    return filename.endsWith('.md') && fs.statSync(filepath).isFile()
  } catch (e) {
    return false
  }
}
