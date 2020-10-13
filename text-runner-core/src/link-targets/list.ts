import * as ast from "../ast"
import * as files from "../filesystem/index"
import { Target, Types } from "./index"
import { targetURL } from "./target-url"

export class List {
  readonly targets: { [key: string]: Target[] }

  constructor() {
    this.targets = {}
  }

  addNodeList(nodeList: ast.NodeList): void {
    for (const node of nodeList) {
      const key = node.location.file.platformified()
      this.targets[key] = this.targets[key] || []
      if (node.type === "anchor_open") {
        this.addAnchor(node)
      } else if (/h[1-6]_open/.test(node.type)) {
        this.addHeading(node, nodeList)
      }
    }
  }

  addAnchor(node: ast.Node): void {
    if (node.attributes.href !== undefined) {
      return
    }
    if (!node.attributes.name) {
      return
    }
    this.addLinkTarget(node.location, "anchor", node.attributes.name)
  }

  addHeading(node: ast.Node, nodeList: ast.NodeList): void {
    const content = nodeList.textInNode(node)
    if (!content) {
      return
    }
    this.addLinkTarget(node.location, "heading", content)
  }

  addLinkTarget(location: files.Location, type: Types, name: string): void {
    const key = location.file.platformified()
    this.targets[key] = this.targets[key] || []
    this.targets[key].push({ name: targetURL(name), type })
  }

  // Returns the type of the given anchor
  // with the given name in the given file
  anchorType(location: files.Location, name: string): string {
    const anchorsForFile = this.targets[location.file.platformified()]
    if (!anchorsForFile) {
      // TODO: make UserError
      throw new Error(`no anchors in file ${location.file.platformified()}`)
    }
    const anchor = anchorsForFile.find(linkTarget => linkTarget.name === name)
    if (!anchor) {
      // TODO: make UserError
      throw new Error(`no anchor '${name}' in file '${location.file.platformified()}'`)
    }
    return anchor.type
  }

  hasAnchor(location: files.Location, name: string): boolean {
    const fileList = this.targets[location.file.platformified()]
    if (!fileList) {
      return false
    }
    return fileList.some(linkTarget => linkTarget.name === name)
  }

  // Returns whether this link target list knows about the given file
  hasFile(filePath: files.FullFilePath): boolean {
    return this.targets[filePath.platformified()] != null
  }
}
