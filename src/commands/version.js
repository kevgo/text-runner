// @flow

// $FlowFixMe: flow doesn't like requiring such an untyped file
const { version } = require('../../package.json')

module.exports = async function run () {
  console.log(`TextRunner v${version}`)
}
