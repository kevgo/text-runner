const { codeFrameColumns } = require('@babel/code-frame')

const rawLines = `class Foo {
  constructor()
}`
const location = { start: { line: 2 } }

const result = codeFrameColumns(rawLines, location, {
  forceColor: true,
  highlightCode: true
})

console.log(result)
