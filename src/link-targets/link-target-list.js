// @flow

import type { LinkTarget } from './link-target.js'

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
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
      const key = node.file.platformified()
      this.targets[key] = this.targets[key] || []
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

  addLinkTarget (filePath: AbsoluteFilePath, type: string, name: string) {
    const key = filePath.platformified()
    this.targets[key] = this.targets[key] || []
    this.targets[key].push({
      type,
      name: kebabCase(name.toLowerCase())
    })
  }

  // Returns the type of the given anchor
  // with the given name in the given file
  anchorType (filePath: AbsoluteFilePath, name: string): string {
    const anchorsForFile = this.targets[filePath.platformified()]
    if (!anchorsForFile) {
      throw new Error(`no anchors in file ${filePath.platformified()}`)
    }
    const anchor = anchorsForFile.find(linkTarget => linkTarget.name === name)
    if (!anchor) {
      throw new Error(
        `no anchor '${name}' in file '${filePath.platformified()}'`
      )
    }
    return anchor.type
  }

  hasAnchor (filePath: AbsoluteFilePath, name: string): boolean {
    const fileList = this.targets[filePath.platformified()]
    if (!fileList) return false
    return fileList.some(linkTarget => linkTarget.name === name)
  }

  // Returns whether this link target list knows about the given file
  hasFile (filePath: AbsoluteFilePath): boolean {
    return this.targets[filePath.platformified()] != null
  }
}
