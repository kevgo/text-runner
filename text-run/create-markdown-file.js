/* eslint no-irregular-whitespace: 0 */

const fs = require('fs')
const path = require('path')

module.exports = function ({formatter, configuration, searcher}) {
  const markdown = searcher.tagContent('fence').replace(/​/g, '')
  fs.writeFileSync(path.join(configuration.testDir, '1.md'), markdown)
}
