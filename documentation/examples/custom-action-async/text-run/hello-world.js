async function delay(duration) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve()
    }, duration)
  })
}

module.exports = async ({ formatter }) => {
  await delay(1)
  formatter.log("Hello World!")
  await delay(1)
}
