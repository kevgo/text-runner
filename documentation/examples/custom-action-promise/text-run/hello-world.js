module.exports = ({ formatter }) => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      formatter.log("Hello World!")
      setTimeout(function() {
        resolve()
      }, 1)
    }, 1)
  })
}
