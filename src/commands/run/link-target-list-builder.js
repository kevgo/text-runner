// @flow

import type { AstNodeList } from '../../parsers/ast-node-list.js'
import type { LinkTargetList } from './link-target-list.js'

const dashify = require('dashify')

class LinkTargetListBuilder {
  // determines which files contain which link targets (anchors)

  // the LinkTarget list that this builder is supposed to populate
  linkTargets: LinkTargetList

  constructor (value: { linkTargets: LinkTargetList }) {
    this.linkTargets = value.linkTargets
  }

  buildLinkTargets (filePath: string, tree: AstNodeList) {
    this.linkTargets[filePath] = this.linkTargets[filePath] || []
    for (let node of tree) {
      switch (node.type) {
        case 'htmltag':
          if (node.content != null) {
            const matches = node.content.match(/<a name="([^"]*)">/)
            if (matches != null) {
              this.linkTargets[filePath].push({
                type: 'anchor',
                name: matches[1]
              })
            }
          }
          break

        case 'heading':
          this.linkTargets[filePath].push({
            type: 'heading',
            name: dashify((node.content || '').toLowerCase()),
            text: node.content,
            level: node.level
          })
          break
      }
    }

    return tree
  }
}

module.exports = LinkTargetListBuilder
