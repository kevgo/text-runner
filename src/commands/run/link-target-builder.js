const dashify = require('dashify')

type LinkTarget = {
  type: string,
  name: string,
  text: string,
  level: string
}

type LinkTargetList = { [string]: Array<LinkTarget> }

class LinkTargetBuilder {
  // determines which files contain which link targets (anchors)

  // the LinkTarget list that this builder is supposed to populate
  linkTargets: LinkTargetList

  constructor (value: {linkTargets: LinkTargetList}) {
    this.linkTargets = value.linkTargets
  }

  buildLinkTargets (filePath: string, tree) {
    this.linkTargets[filePath] = this.linkTargets[filePath] || []
    for (let node of tree) {
      switch (node.type) {
        case 'htmltag':
          const matches = node.content.match(/<a name="([^"]*)">/)
          if (matches) {
            this.linkTargets[filePath].push({type: 'anchor', name: matches[1]})
          }
          break

        case 'heading':
          this.linkTargets[filePath].push({type: 'heading',
            name: dashify(node.content),
            text: node.content,
            level: node.level})
          break
      }
    }

    return tree
  }
}

module.exports = LinkTargetBuilder
