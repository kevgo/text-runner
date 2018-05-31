module.exports = ({ formatter }, done) => {
  setTimeout(function () {
    formatter.log('Hello World!')
    setTimeout(function () {
      done()
    }, 1)
  }, 1)
}
