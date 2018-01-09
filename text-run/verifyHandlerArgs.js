const jsdiffConsole = require('jsdiff-console')
const removeTrailingColon = require('../dist/helpers/remove-trailing-colon.js')
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
