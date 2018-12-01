export default (async function versionCommand() {
  const { version } = require('../../package.json')
  console.log(`TextRunner v${version}`)
})
