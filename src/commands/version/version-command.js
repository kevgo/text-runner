// @flow

// $FlowFixMe: flow doesn't like requiring such an untyped file
const {version} = require('../../../package.json')

class VersionCommand implements Command {
  run (done: DoneFunction) {
    console.log(`TextRunner v${version}`)
    done()
  }
}

module.exports = VersionCommand
