// $FlowFixMe: flow doesn't like requiring such an untyped file
const { version } = require("../../package.json")

export default (async function versionCommand() {
  console.log(`TextRunner v${version}`)
})
