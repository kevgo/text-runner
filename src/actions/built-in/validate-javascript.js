// @flow

// Runs the JavaScript code given in the code block
module.exports = function (args: Activity) {
  args.formatter.start('validating JavaScript')

  const code = args.searcher.tagContent('fence')

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
