// @flow

import type { Command } from '../command.js'

const fs = require('fs')
const path = require('path')

class AddCommand implements Command {
  async run(filename: string) {
    if (!fs.existsSync('text-run')) {
      fs.mkdirSync('text-run')
    }
    fs.writeFileSync(path.join('text-run', filename + '.js'), this._template(), 'utf8')
  }

  _template() {
    return `module.exports = async function ({formatter, searcher}) {

  // capture content from the document
  const content = searcher.tagContent('boldtext')

  // do something with the content
  formatter.output(content)
}
`
  }
}

module.exports = AddCommand
