// @flow

// Runs the JavaScript code given in the code block
module.exports = function (activity: Activity) {
  activity.formatter.action('validating JavaScript')

  const code = activity.searcher.nodeContent({type: 'fence'}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no code to run found'
    if (nodes.length > 1) return 'too many code blocks found'
    if (!content) return 'no JavaScript code found in the fenced block'
  })

  activity.formatter.output(code)

  try {
    /* eslint-disable no-new, no-new-func */
    new Function(code)
  } catch (e) {
    throw new Error(`invalid Javascript: ${e.message}`)
  }
}
