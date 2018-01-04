// @flow

// Runs the JavaScript code given in the code block
module.exports = function (args: Activity) {
  args.formatter.action('validating JavaScript')
  const code = args.searcher.tagContent('fence')
  args.formatter.output(code)

  try {
    /* eslint-disable no-new, no-new-func */
    new Function(code)
  } catch (e) {
    throw new Error(`invalid Javascript: ${e.message}`)
  }
}
