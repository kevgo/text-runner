const jsdiffConsole = require('jsdiff-console')
const removeValue = require('remove-value')

module.exports = function (args) {
  const expectedTools = args.searcher.tagsContents('strongtext')
                                     .sort()
                                     .map(removeTrailingColon)
  const actualTools = Object.keys(args).sort()
  removeValue(actualTools, 'activityTypeName')
  removeValue(actualTools, 'linkTargets')
  jsdiffConsole(actualTools, expectedTools)
}

function removeTrailingColon (text) {
  if (text.endsWith(':')) {
    return text.substring(0, text.length - 1)
  } else {
    return text
  }
}
