// @flow

const fs = require('fs')
const commandPath = require('./command-path')

module.exports = function (command :string) :boolean {
  try {
    fs.statSync(commandPath(command))
    return true
  } catch (e) {
    return false
  }
}
