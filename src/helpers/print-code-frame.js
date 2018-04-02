// @flow

const fs = require('fs')
const { codeFrameColumns } = require('@babel/code-frame')

type PrintFunc = string => void

module.exports = function (output: PrintFunc, filename: ?string, line: ?number) {
  if (filename == null || line == null) return

  const fileContent = fs.readFileSync(filename)
  output(
    codeFrameColumns(
      fileContent,
      { start: { line: line } },
      { forceColor: true }
    )
  )
}
