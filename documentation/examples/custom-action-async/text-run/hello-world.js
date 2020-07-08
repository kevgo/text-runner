async function delay(duration) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration)
  })
}

module.exports = async ({ log }) => {
  await delay(1)
  log("Hello World!")
  await delay(1)
}
