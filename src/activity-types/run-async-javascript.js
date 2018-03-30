// @flow

import type { Activity } from '../commands/run/activity.js'
import type Configuration from '../configuration/configuration.js'

// Runs the async-await JavaScript code given in the code block
module.exports = function (activity: Activity) {
  activity.formatter.setTitle('run async javascript')
  var code = activity.searcher.tagContent('fence')
  if (code == null) {
    throw new Error('no JavaScript code found in the fenced block')
  }
  code = replaceSubstitutions(code, activity.configuration)
  code = replaceRequireLocalModule(code)
  code = replaceVariableDeclarations(code)
  code = wrapInAsyncFunction(code)
  activity.formatter.output(code)
  /* eslint-disable no-eval */
  eval(code)
}

function wrapInAsyncFunction (code) {
  return `(async function() {
  ${code}
})()`
}

// substitutes replacements configured in text-run.yml
function replaceSubstitutions (code: string, c: Configuration): string {
  try {
    // $FlowFixMe: we can ignore undefined values here since `code` has a default value
    for (let replaceData of c.fileData.actions.runJavascript.replace) {
      code = code.replace(replaceData.search, replaceData.replace)
    }
  } catch (e) {
    // ignoring type errors here since `code` has a default value
  }
  return code
}

// makes sure "require('.') works as expected even if running in a temp workspace
function replaceRequireLocalModule (code: string): string {
  return code.replace(/require\(['"].['"]\)/, 'require(process.cwd())')
}

// make variable declarations persist across code blocks
function replaceVariableDeclarations (code: string): string {
  return code
    .replace(/\bconst /g, 'global.')
    .replace(/\bvar /g, 'global.')
    .replace(/\bthis\./g, 'global.')
}