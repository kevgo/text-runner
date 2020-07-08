module.exports = ({ log }) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      log("Hello World!")
      setTimeout(function () {
        resolve()
      }, 1)
    }, 1)
  })
}
