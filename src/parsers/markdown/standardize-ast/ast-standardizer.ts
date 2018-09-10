import Transformer from "../standardize-ast/transformer.js"
import TransformerList from "../standardize-ast/transformer-list.js"

import AbsoluteFilePath from "../../../domain-model/absolute-file-path"
import AstNodeList from "../../ast-node-list"
import FormattingTracker from "../helpers/formatting-tracker"
import getHtmlBlockTag from "../helpers/get-html-block-tag"
import loadTransformers from "../standardize-ast/load-transformers"
import OpenTagTracker from "../helpers/open-tag-tracker"
import removeHtmlComments from "../helpers/remove-html-comments"
import UnprintedUserError from "../../../errors/unprinted-user-error"

const mdTransformers = loadTransformers("md")
const htmlBlockTransformers = loadTransformers("htmlblock")
const htmlTagTransformers = loadTransformers("htmltag")

// AstStandardizer converts the AST created by Remarkable
// into the standardized AST used by TextRunner
export default class AstStandardizer {
  filepath: AbsoluteFilePath
  formattingTracker: FormattingTracker
  openTags: OpenTagTracker
  result: AstNodeList
  line: number

  constructor(filepath: AbsoluteFilePath) {
    this.filepath = filepath
    this.openTags = new OpenTagTracker()
    this.result = new AstNodeList()
    this.line = 1
  }

  async standardize(ast: any): Promise<AstNodeList> {
    for (let node of ast) {
      if (node.lines) this.line = Math.max(node.lines[0] + 1, this.line)

      if (node.children) {
        for (let child of node.children) child.lines = node.lines
        await this.standardize(node.children)
        continue
      }

      if (this.processSoftBreak(node)) continue
      const processed = await this.processHtmlBlock(node)
      if (processed) continue
      if (this.processHtmlTag(node)) continue
      if (this.processMdNode(node)) continue
      alertUnknownNodeType(node, this.filepath.platformified(), this.line)
    }
    return this.result
  }

  async processHtmlBlock(node: any): Promise<boolean> {
    if (node.type !== "htmlblock") return false
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      this.filepath,
      this.line
    )
    const transformer = htmlBlockTransformers[tagName]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML block: '${tagName}'`,
        this.filepath.platformified(),
        this.line
      )
    }
    const transformed = await transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const node of transformed) {
      this.result.push(node)
    }
    return true
  }

  processHtmlTag(node: any): boolean {
    if (node.type !== "htmltag") return false
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      this.filepath,
      this.line
    )
    const transformer = htmlTagTransformers[tagName.replace("/", "_")]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML tag: '${tagName}'`,
        this.filepath.platformified(),
        this.line
      )
    }
    const transformed = transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const node of transformed) {
      this.result.push(node)
    }
    return true
  }

  processMdNode(node: any): boolean {
    const transformer = mdTransformers[node.type]
    if (!transformer) return false
    const transformed = transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const node of transformed) {
      this.result.push(node)
    }
    return true
  }

  processSoftBreak(node: any): boolean {
    if (node.type !== "softbreak") return false
    this.line += 1
    return true
  }
}

function alertUnknownNodeType(node, filepath: string, line: number) {
  throw new UnprintedUserError(
    `AstStandardizer: unknown node type: ${node.type}`,
    filepath,
    line
  )
}
