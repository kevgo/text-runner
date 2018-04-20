// @flow

import type { Command } from '../command.js'

const fs = require('fs')
const path = require('path')

class AddCommand implements Command {
  async run (filename: string) {
    if (!fs.existsSync('text-run')) {
      fs.mkdirSync('text-run')
    }
    fs.writeFileSync(
      path.join('text-run', filename + '.js'),
      this._template(filename),
      'utf8'
    )
  }

  _template (filename: string) {
    return `module.exports = async function (activity) {
  console.log('This code runs inside the "${filename}" block implementation.')
  console.log('I found these elements in your document:')
  console.log(activity.nodes)

  // capture content from the document
  // const content = activity.searcher.tagContent('boldtext')
  // do something with the content
  // formatter.output(content)
}
`
  }
}

module.exports = AddCommand
