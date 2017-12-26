// @flow

const fs = require('fs')
const path = require('path')

// returns a list of all available commands
module.exports = function () :string[] {
  return fs.readdirSync(path.join(__dirname, '..', 'commands'))
}
