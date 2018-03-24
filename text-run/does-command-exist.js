const fs = require('fs')
const path = require('path')

module.exports = async function ({ formatter, searcher }) {
  const filename = searcher.tagContent('code')
  try {
    fs.lstatSync(path.join(process.cwd(), filename))
  } catch (e) {
    throw new Error(`binary '${filename}' does not exist`)
  }
}
