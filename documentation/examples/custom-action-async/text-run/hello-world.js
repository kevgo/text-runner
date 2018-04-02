const delay = require('delay')

module.exports = async ({ formatter }) => {
  await delay(1)
  formatter.output('Hello World!')
  await delay(1)
}
