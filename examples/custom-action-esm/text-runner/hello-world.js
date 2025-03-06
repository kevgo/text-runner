import util from "util"
const delay = util.promisify(setTimeout)

export function helloWorldSync(action) {
  action.log("Greetings from the sync action!")
}

export async function helloWorldAsync(action) {
  await delay(1)
  action.log("Greetings from the async action!")
  await delay(1)
}

export function helloWorldCallback(action, done) {
  setTimeout(function() {
    action.log("Greetings from the callback action!")
    setTimeout(done, 1)
  }, 1)
}

export function helloWorldPromise(action) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      action.log("Greetings from the promise-based action!")
      setTimeout(resolve, 1)
    }, 1)
  })
}
