// @flow

import type { AstNode } from '../../../parsers/ast-node.js'
import type { AstNodeList } from '../../../parsers/ast-node-list.js'
import type { LinkTargetList } from './link-target-list.js'

const dashify = require('dashify')

class LinkTargetListBuilder {
  // determines which files contain which link targets (anchors)

  // the LinkTarget list that this builder is supposed to populate
  linkTargets: LinkTargetList

  constructor () {
    this.linkTargets = {}
  }

  addLinkTargets (tree: AstNodeList) {
    const searcher = new AstNodeListSearcher(tree)
    for (let node of tree) {
      if (node.type === 'anchor_open') {
        this._addAnchor(node)
      } else if (node.type === 'heading_open') {
        this._addHeading(node)
      }
    }
  }

  _addAnchor (node: AstNode) {
    if (node.attributes['href'] !== undefined) return
    if (!node.attributes['name']) return
    this._addLinkTarget(node.file, 'anchor', node.attributes.name)
  }

  _addHeading (node: AstNode, searcher: Searcher) {
    const content = dashify(searcher.getTextFor(node)).toLowerCase()
    this._addLinkTarget(node.file, 'heading', content)
  }

  _addLinkTarget (filepath: string, type: string, name: string) {
    this.linkTargets[filepath] = this.linkTargets[filepath] || []
    this.linkTargets[filepath].push({ type, name })
  }
}

module.exports = LinkTargetListBuilder
