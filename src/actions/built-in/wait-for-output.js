// @flow

// Waits until the currently running console command produces the given output
module.exports = async function (args: {formatter: Formatter, searcher: Searcher}) {
  args.formatter.action('waiting for output of the running console process')
  const expectedOutput = args.searcher.tagContent('fence')
  const expectedLines = expectedOutput.split('\n')
                                      .map((line) => line.trim())
                                      .filter((line) => line)
  for (let line of expectedLines) {
    args.formatter.output(`waiting for ${line}`)
    await global.runningProcess.waitForText(line)
  }
}
