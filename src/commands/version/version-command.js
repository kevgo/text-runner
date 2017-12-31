// @flow

// $FlowFixMe: flow doesn't like requiring such an untyped file
const {version} = require('../../../package.json')

class VersionCommand implements Command {
  async run (): Promise<?ErrnoError> {
    console.log(`TextRunner v${version}`)
  }
}

module.exports = VersionCommand
