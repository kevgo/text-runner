import * as ast from "../ast/index.js"
import * as files from "../filesystem/index.js"
import { Target, Types } from "./index.js"
import { targetURL } from "./target-url.js"

export class List {
  readonly targets: Record<string, Target[]>

  constructor() {
    this.targets = {}
  }

  addAnchor(node: ast.Node): void {
    if (node.attributes.href !== undefined) {
      return
    }
    if (!node.attributes.name) {
      return
    }
    this.addLinkTarget(node.location.file, "anchor", node.attributes.name)
  }

  addHeading(node: ast.Node, nodeList: ast.NodeList): void {
    const content = nodeList.textInNode(node)
    if (!content) {
      return
    }
    this.addLinkTarget(node.location.file, "heading", content)
  }

  addLinkTarget(file: files.FullFilePath, type: Types, name: string): void {
    const key = file.platformified()
    this.targets[key] = this.targets[key] || []
    this.targets[key].push({ name: targetURL(name), type })
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

  // Returns the type of the given anchor
  // with the given name in the given file
  anchorType(file: files.FullFilePath, name: string): string {
    const anchorsForFile = this.targets[file.platformified()]
    if (!anchorsForFile) {
      // TODO: make UserError
      throw new Error(`no anchors in file ${file.platformified()}`)
    }
    const anchor = anchorsForFile.find(linkTarget => linkTarget.name === name)
    if (!anchor) {
      // TODO: make UserError
      throw new Error(`no anchor '${name}' in file '${file.platformified()}'`)
    }
    return anchor.type
  }

  getAnchor(file: files.FullFilePath, name: string): null | Target {
    for (const target of this.targets[file.platformified()] || []) {
      if (target.name === name) {
        return target
      }
    }
    return null
  }

  /** provides all the anchors for the given file */
  getAnchors(file: files.FullFilePath): string[] {
    return (this.targets[file.platformified()] || []).map(target => target.name)
  }

  hasAnchor(file: files.FullFilePath, name: string): boolean {
    return this.getAnchor(file, name) != null
  }

  // Returns whether this link target list knows about the given file
  hasFile(filePath: files.FullFilePath): boolean {
    return this.targets[filePath.platformified()] != null
  }
}
