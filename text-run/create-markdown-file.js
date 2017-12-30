const fs = require('fs')
const path = require('path')

module.exports = function ({formatter, configuration, searcher}) {
  formatter.start('creating markdown file')

  const markdown = searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no fenced block found'
    if (!content) return 'the block that defines markdown to run is empty'
  }).replace(/​/g, '')

  fs.writeFileSync(path.join(configuration.testDir, '1.md'), markdown)
  formatter.success()
}
