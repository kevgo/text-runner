// @flow

const fs = require('fs')
const { codeFrameColumns } = require('@babel/code-frame')

type PrintFunc = string => void | boolean

module.exports = function (output: PrintFunc, filename: ?string, line: ?number) {
  if (!filename || line == null) return

  const fileContent = fs.readFileSync(filename, 'utf8')
  output(
    codeFrameColumns(
      fileContent,
      { start: { line: line } },
      { forceColor: true }
    )
  )
}
