const fs = require("fs")
const path = require("path")

module.exports = function(args) {
  const markdown = args.nodes.textInNodeOfType("fence").replace(/​/g, "")
  fs.writeFileSync(path.join(args.configuration.workspace, "1.md"), markdown)
}
