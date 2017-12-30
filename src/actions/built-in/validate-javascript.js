// @flow

// Runs the JavaScript code given in the code block
module.exports = function (args: {formatter: Formatter, searcher: Searcher, configuration: Configuration}) {
  args.formatter.start('validating JavaScript')

  const code = args.searcher.nodeContent({type: 'fence'}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no code to run found'
    if (nodes.length > 1) return 'too many code blocks found'
    if (!content) return 'no JavaScript code found in the fenced block'
  })

  args.formatter.output(code)

  try {
    /* eslint-disable no-new, no-new-func */
    new Function(code)
    args.formatter.success('valid Javascript code')
  } catch (e) {
    args.formatter.error(`invalid Javascript: ${e.message}`)
    throw new Error('1')
  }
}
