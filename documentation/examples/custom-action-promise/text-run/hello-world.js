module.exports = ({ formatter }) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      formatter.log('Hello World!')
      setTimeout(function () {
        resolve()
      }, 1)
    }, 1)
  })
}
