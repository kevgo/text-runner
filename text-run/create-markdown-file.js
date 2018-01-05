const fs = require('fs')
const path = require('path')

module.exports = function ({formatter, configuration, searcher}) {
  formatter.action('creating markdown file')
  const markdown = searcher.tagContent('fence').replace(/​/g, '')
  fs.writeFileSync(path.join(configuration.testDir, '1.md'), markdown)
}
