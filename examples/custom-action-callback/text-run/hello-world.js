module.exports = (action, done) => {
  setTimeout(function () {
    action.log("Hello World!")
    setTimeout(function () {
      done()
    }, 1)
  }, 1)
}
