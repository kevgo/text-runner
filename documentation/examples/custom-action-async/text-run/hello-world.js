const delay = require('delay')

module.exports = async ({ formatter }) => {
  await delay(1)
  formatter.log('Hello World!')
  await delay(1)
}
