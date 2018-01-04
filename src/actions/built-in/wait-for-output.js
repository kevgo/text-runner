// @flow

// Waits until the currently running console command produces the given output
module.exports = async function (activity: Activity) {
  activity.formatter.action('waiting for output of the running console process')

  const expectedOutput = activity.searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no code blocks found'
    if (nodes.length > 1) return `found ${nodes.length} fenced code blocks. Expecting a maximum of 1.`
    if (!content) return 'the block that defines console commands to run is empty'
  })

  const expectedLines = expectedOutput.split('\n')
                                      .map((line) => line.trim())
                                      .filter((line) => line)

  for (let line of expectedLines) {
    activity.formatter.output(`waiting for ${line}`)
    await global.runningProcess.waitForText(line)
  }
}
