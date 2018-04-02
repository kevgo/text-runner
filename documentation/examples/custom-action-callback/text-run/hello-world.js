module.exports = ({ formatter }, done) => {
  setTimeout(function () {
    formatter.output('Hello World!')
    setTimeout(function () {
      done()
    }, 1)
  }, 1)
}
