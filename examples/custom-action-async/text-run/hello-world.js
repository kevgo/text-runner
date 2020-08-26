async function delay(duration) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration)
  })
}

module.exports = async (action) => {
  await delay(1)
  action.log("Hello World!")
  await delay(1)
}
