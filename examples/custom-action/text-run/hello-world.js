const util = require("util")
const delay = util.promisify(setTimeout)

function helloWorldSync(action) {
  action.log("Greetings from the sync action!")
}

async function helloWorldAsync(action) {
  await delay(1)
  action.log("Greetings from the async action!")
  await delay(1)
}

function helloWorldCallback(action, done) {
  setTimeout(function () {
    action.log("Greetings from the callback action!")
    setTimeout(function () {
      // TODO: inline
      done()
    }, 1)
  }, 1)
}

function helloWorldPromise(action) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      action.log("Greetings from the promise-based action!")
      setTimeout(function () {
        // TODO: inline
        resolve()
      }, 1)
    }, 1)
  })
}

module.exports = {
  helloWorldAsync,
  helloWorldCallback,
  helloWorldPromise,
  helloWorldSync,
}
