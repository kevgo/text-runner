// @flow

const fs = require('fs-extra')

module.exports = async function readFile (filename: string) {
  return fs.readFile(filename, { encoding: 'utf8' })
}
