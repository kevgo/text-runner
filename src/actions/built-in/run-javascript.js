// @flow

// Runs the JavaScript code given in the code block
module.exports = function (args: {formatter: Formatter, searcher: Searcher, configuration: Configuration}, done: DoneFunction) {
  args.formatter.start('running JavaScript code')

  var code = args.searcher.nodeContent({type: 'fence'}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no code to run found'
    if (nodes.length > 1) return 'too many code blocks found'
    if (!content) return 'no JavaScript code found in the fenced block'
  })
  if (code == null) {
    args.formatter.error('no JavaScript code found in the fenced block')
    return
  }
  code = replaceSubstitutionsInConfiguration(code, args.configuration)
  code = replaceRequireLocalModule(code)
  code = replaceVariableDeclarations(code)

  /* eslint-disable no-unused-vars */  // This is used in an eval'ed string below
  const __finished = (err) => {
    if (err) {
      args.formatter.error(err)
    } else {
      args.formatter.success()
      done(err)
    }
  }

  if (hasCallbackPlaceholder(code)) {
    // async code
    code = replaceAsyncCallbacks(code)
  } else {
    // sync code
    code = appendAsyncCallback(code)
  }
  args.formatter.output(code)
  /* eslint-disable no-eval */
  eval(code)
}

function appendAsyncCallback (code: string): string {
  return `${code.trim()};\n__finished()`
}

function replaceAsyncCallbacks (code: string): string {
  return code.replace('<CALLBACK>', '__finished')
             .replace(/\/\/\s*\.\.\./g, '__finished()')
}

// substitutes replacements configured in text-run.yml
function replaceSubstitutionsInConfiguration (code: string, configuration: Configuration): string {
  try {
    for (let replaceData of configuration.fileData.actions.runJavascript.replace) {
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
  return code.replace(/\bconst /g, 'global.')
             .replace(/\bvar /g, 'global.')
             .replace(/\bthis\./g, 'global.')
}

// returns whether the given code block contains a callback placeholder
function hasCallbackPlaceholder (code): boolean {
  return (code.indexOf('<CALLBACK>') > -1) || (code.indexOf('// ...') > -1)
}
