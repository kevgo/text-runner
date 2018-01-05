module.exports = ({formatter}, done) => {
  formatter.action('greeting the world')
  setTimeout(function () {
    formatter.output('Hello World!')
    setTimeout(function () {
      formatter.success()
      done()
    }, 1)
  }, 1)
}
