module.exports = ({ log }, done) => {
  setTimeout(function () {
    log("Hello World!")
    setTimeout(function () {
      done()
    }, 1)
  }, 1)
}
