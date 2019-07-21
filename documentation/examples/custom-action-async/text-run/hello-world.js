const delay = require("delay")

module.exports = async ({ log }) => {
  await delay(1)
  log("Hello World!")
  await delay(1)
}
