// @flow

module.exports = async function runHandler (handlerFunc: HandlerFunction) {
  try {
    if (handlerFunc.length === 1) {
      // synchronous activity or returns a promise
      await Promise.resolve(handlerFunc(activity))
    } else {
      // asynchronous activity
      const promisified = util.promisify(activity.runner)
      await promisified(activity)
    }
    formatter.success()
  } catch (err) {
    if (isUserError(err)) {
      throw new UnprintedUserError(err.message, filename, line)
    } else {
      // here we have a developer error
      throw err
    }
  }
}
