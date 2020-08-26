module.exports = (action) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      action.log("Hello World!")
      setTimeout(function () {
        resolve()
      }, 1)
    }, 1)
  })
}
