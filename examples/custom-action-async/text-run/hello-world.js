const util = require("util")
const delay = util.promisify(setTimeout)

module.exports = async (action) => {
  await delay(1)
  action.log("Hello World!")
  await delay(1)
}
