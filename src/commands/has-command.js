// @flow

const availableCommands = require('./available-commands.js')

module.exports = function (command: string): boolean {
  return availableCommands().includes(command)
}
