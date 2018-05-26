// @flow

import type { LinkTarget } from './link-target.js'

const AstNode = require('../parsers/ast-node.js')
const AstNodeList = require('../parsers/ast-node-list.js')
const kebabCase = require('just-kebab-case')

module.exports = class LinkTargetList {
  targets: { [string]: Array<LinkTarget> }

  constructor () {
    this.targets = {}
  }

  addNodeList (nodeList: AstNodeList) {
    for (const node of nodeList) {
      this.targets[node.file] = this.targets[node.file] || []
      if (node.type === 'anchor_open') {
        this.addAnchor(node)
      } else if (node.type === 'heading_open') {
        this.addHeading(node, nodeList)
      }
    }
  }

  addAnchor (node: AstNode) {
    if (node.attributes['href'] !== undefined) return
    if (!node.attributes['name']) return
    this.addLinkTarget(node.file, 'anchor', node.attributes['name'])
  }

  addHeading (node: AstNode, nodeList: AstNodeList) {
    const content = nodeList.textInNode(node)
    if (!content) return
    this.addLinkTarget(node.file, 'heading', content)
  }

  addLinkTarget (filepath: string, type: string, name: string) {
    this.targets[filepath].push({ type, name: kebabCase(name.toLowerCase()) })
  }
}
