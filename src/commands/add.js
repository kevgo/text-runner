// @flow

const fs = require('fs')
const path = require('path')

module.exports = async function addCommand (
  blockName: ?string
): Promise<Array<Error>> {
  if (!blockName) throw new Error('no block name given')
  if (!fs.existsSync('text-run')) {
    fs.mkdirSync('text-run')
  }
  fs.writeFileSync(
    path.join('text-run', blockName + '.js'),
    template(blockName),
    'utf8'
  )
  return []
}

function template (filename: string) {
  return `module.exports = async function (activity) {
  console.log('This code runs inside the "${filename}" block implementation.')
  console.log('I found these elements in your document:')
  console.log(activity.nodes)

  // capture content from the document
  // const content = activity.searcher.tagContent('boldtext')
  // do something with the content
  // formatter.log(content)
}
`
}
