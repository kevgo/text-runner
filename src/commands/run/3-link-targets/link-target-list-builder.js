// @flow

import type { AstNodeList } from '../2-read-and-parse/ast-node-list.js'
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
    for (let node of tree) {
      switch (node.type) {
        case 'htmltag':
          this._addAnchorTag(node.filepath, node.content)
          break

        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          this._addHeading(node.filepath, node.content)
          break
      }
    }
  }

  _addAnchorTag (filepath: string, html: string) {
    const matches = html.match(/<a name="([^"]*)">/)
    if (!matches) return
    this._addLinkTarget(filepath, 'anchor', matches[1])
  }

  _addHeading (filepath: string, text: string) {
    const content = dashify(text).toLowerCase()
    this._addLinkTarget(filepath, 'heading', content)
  }

  _addLinkTarget (filepath: string, type: string, name: string) {
    this.linkTargets[filepath] = this.linkTargets[filepath] || []
    this.linkTargets[filepath].push({ type, name })
  }
}

module.exports = LinkTargetListBuilder
