const util = require("util")
const delay = util.promisify(setTimeout)

async function helloWorldAsync(action) {
  await delay(1)
  action.log("Greetings from the async action!")
  await delay(1)
}

function helloWorldCallback(action, done) {
  setTimeout(() => {
    action.log("Greetings from the callback action!")
    setTimeout(done, 1)
  }, 1)
}

function helloWorldPromise(action) {
  return new Promise(resolve => {
    setTimeout(() => {
      action.log("Greetings from the promise-based action!")
      setTimeout(resolve, 1)
    }, 1)
  })
}

function helloWorldSync(action) {
  action.log("Greetings from the sync action!")
}

module.exports = {
  helloWorldAsync,
  helloWorldCallback,
  helloWorldPromise,
  helloWorldSync
}
