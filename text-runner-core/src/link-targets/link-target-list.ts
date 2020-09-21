import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { AstNode } from "../parsers/standard-AST/ast-node"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { LinkTarget } from "./types/link-target"
import { LinkTargetTypes } from "./types/link-target-types"
import { targetURL } from "./target-url"

export class LinkTargetList {
  readonly targets: { [key: string]: LinkTarget[] }

  constructor() {
    this.targets = {}
  }

  addNodeList(nodeList: AstNodeList): void {
    for (const node of nodeList) {
      const key = node.file.platformified()
      this.targets[key] = this.targets[key] || []
      if (node.type === "anchor_open") {
        this.addAnchor(node)
      } else if (/h[1-6]_open/.test(node.type)) {
        this.addHeading(node, nodeList)
      }
    }
  }

  addAnchor(node: AstNode): void {
    if (node.attributes.href !== undefined) {
      return
    }
    if (!node.attributes.name) {
      return
    }
    this.addLinkTarget(node.file, "anchor", node.attributes.name)
  }

  addHeading(node: AstNode, nodeList: AstNodeList): void {
    const content = nodeList.textInNode(node)
    if (!content) {
      return
    }
    this.addLinkTarget(node.file, "heading", content)
  }

  addLinkTarget(filePath: AbsoluteFilePath, type: LinkTargetTypes, name: string): void {
    const key = filePath.platformified()
    this.targets[key] = this.targets[key] || []
    this.targets[key].push({ name: targetURL(name), type })
  }

  // Returns the type of the given anchor
  // with the given name in the given file
  anchorType(filePath: AbsoluteFilePath, name: string): string {
    const anchorsForFile = this.targets[filePath.platformified()]
    if (!anchorsForFile) {
      throw new Error(`no anchors in file ${filePath.platformified()}`)
    }
    const anchor = anchorsForFile.find(linkTarget => linkTarget.name === name)
    if (!anchor) {
      throw new Error(`no anchor '${name}' in file '${filePath.platformified()}'`)
    }
    return anchor.type
  }

  hasAnchor(filePath: AbsoluteFilePath, name: string): boolean {
    const fileList = this.targets[filePath.platformified()]
    if (!fileList) {
      return false
    }
    return fileList.some(linkTarget => linkTarget.name === name)
  }

  // Returns whether this link target list knows about the given file
  hasFile(filePath: AbsoluteFilePath): boolean {
    return this.targets[filePath.platformified()] != null
  }
}
