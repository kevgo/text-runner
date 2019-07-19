import { AbsoluteFilePath } from "../../../domain-model/absolute-file-path"
import { AstNodeList } from "../../ast-node-list"
import { OpenTagTracker } from "../helpers/open-tag-tracker"
import { CustomHtmlTagTransformerBlock } from "./custom-html-tags/custom-html-tag-transformer-block"
import { CustomHtmlBlockTransformerBlock } from "./custom-htmlblocks/custom-html-block-transformer-block"
import { CustomMdTransformerBlock } from "./custom-md/custom-md-transformer-block"
import { GenericHtmlTagTransformerBlock } from "./generic-htmltags/generic-html-tag-transformer-block"
import { GenericMdTransformerBlock } from "./generic-md/generic-md-transformer-block"
import { RemarkableNode } from "./remarkable-node"
import { TagMapper } from "./tag-mapper"
import { TransformerBlock } from "./transformer-block"

/**
 * AstStandardizer converts the AST created by Remarkable
 * into the standardized AST used by TextRunner
 */
export default class AstStandardizer {
  filepath: AbsoluteFilePath
  line: number
  openTags: OpenTagTracker
  result: AstNodeList
  tagMapper: TagMapper
  transformerBlocks: TransformerBlock[]

  constructor(filepath: AbsoluteFilePath) {
    this.filepath = filepath
    this.line = 1
    this.openTags = new OpenTagTracker()
    this.tagMapper = new TagMapper()
    this.result = new AstNodeList()
    this.transformerBlocks = [
      new CustomHtmlBlockTransformerBlock(this.openTags),
      new CustomHtmlTagTransformerBlock(this.openTags),
      new GenericHtmlTagTransformerBlock(this.openTags, this.tagMapper),
      new CustomMdTransformerBlock(this.openTags),
      new GenericMdTransformerBlock(this.openTags, this.tagMapper)
    ]
  }

  async loadTransformers() {
    return Promise.all(this.transformerBlocks.map(tb => tb.loadTransformers()))
  }

  async standardize(ast: any): Promise<AstNodeList> {
    for (const n of ast) {
      const node = n as RemarkableNode
      if (node.lines) {
        this.line = Math.max(node.lines[0] + 1, this.line)
      }

      if (node.children) {
        for (const child of node.children) {
          child.lines = node.lines
        }
        await this.standardize(node.children)
        continue
      }

      if (this.processSoftBreak(node)) {
        continue
      }

      const transformed = await this.transform(node)
      for (const transformedNode of transformed) {
        this.result.push(transformedNode)
      }
    }
    return this.result
  }

  async transform(node: RemarkableNode): Promise<AstNodeList> {
    for (const transformerBlock of this.transformerBlocks) {
      if (transformerBlock.canTransform(node, this.filepath, this.line)) {
        return transformerBlock.transform(node, this.filepath, this.line)
      }
    }
    throw new Error(`Unprocessable node: ${node.type}`)
  }

  processSoftBreak(node: RemarkableNode): boolean {
    if (node.type !== "softbreak") {
      return false
    }
    this.line += 1
    return true
  }
}
