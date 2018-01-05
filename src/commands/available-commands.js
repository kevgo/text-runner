// @flow

const fs = require('fs')
const path = require('path')

// returns a list of all available commands
module.exports = function () :string[] {
  const commandDir = path.join(__dirname, '..', 'commands')
  return fs.readdirSync(commandDir).filter(f => fs.statSync(path.join(commandDir, f)).isDirectory())
}
