const classMethods = require('class-methods')
const jsdiffConsole = require('jsdiff-console')
const removeTrailingColon = require('../dist/helpers/remove-trailing-colon.js')
const removeValue = require('remove-value')
const Searcher = require('../dist/commands/run/searcher.js')

module.exports = function ({searcher}) {
  const expectedTools = searcher.tagsContents('strongtext')
                                .sort()
                                .map(removeTrailingColon)
  var actualTools = classMethods(Searcher).filter(isPublicMethod)
  actualTools = actualTools.concat(Object.getOwnPropertyNames(searcher))
  actualTools.sort()
  removeValue(actualTools, 'query')
  jsdiffConsole(actualTools, expectedTools)
}

function isPublicMethod (methodName) {
  return !methodName.startsWith('_')
}
