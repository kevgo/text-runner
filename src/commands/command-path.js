// @flow

const path = require('path')

module.exports = function (command: string): string {
  return path.join(__dirname, '..', 'commands', command, `${command}-command.js`)
}
