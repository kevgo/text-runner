import { AbsoluteFilePath } from "../../../finding-files/absolute-file-path"
import { AstNodeList } from "../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../helpers/open-tag-tracker"
import { CustomHtmlTagTransformerBlock } from "./custom-html-tags/custom-html-tag-transformer-block"
import { CustomHtmlBlockTransformerBlock } from "./custom-htmlblocks/custom-html-block-transformer-block"
import { CustomMdTransformerBlock } from "./custom-md/custom-md-transformer-block"
import { GenericHtmlTagTransformerBlock } from "./generic-htmltags/generic-html-tag-transformer-block"
import { GenericMdTransformerBlock } from "./generic-md/generic-md-transformer-block"
import { TagMapper } from "./tag-mapper"
import { RemarkableNode } from "./types/remarkable-node"
import { TransformerCategory } from "./types/transformer-category"

/**
 * AstStandardizer converts an AST created by Remarkable
 * into the standardized AST format used by TextRunner
 */
export default class AstStandardizer {
  private readonly filepath: AbsoluteFilePath
  private line: number
  private readonly openTags: OpenTagTracker
  private readonly result: AstNodeList
  private readonly tagMapper: TagMapper
  private readonly transformerCategories: TransformerCategory[]

  constructor(filepath: AbsoluteFilePath) {
    this.filepath = filepath
    this.line = 1
    this.openTags = new OpenTagTracker()
    this.tagMapper = new TagMapper()
    this.result = new AstNodeList()
    this.transformerCategories = [
      new CustomHtmlBlockTransformerBlock(this.openTags),
      new CustomHtmlTagTransformerBlock(this.openTags),
      new GenericHtmlTagTransformerBlock(this.openTags, this.tagMapper),
      new CustomMdTransformerBlock(this.openTags),
      new GenericMdTransformerBlock(this.openTags, this.tagMapper)
    ]
  }

  async loadTransformers() {
    return Promise.all(
      this.transformerCategories.map(tb => tb.loadTransformers())
    )
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

  private async transform(node: RemarkableNode): Promise<AstNodeList> {
    for (const transformerCategory of this.transformerCategories) {
      if (transformerCategory.canTransform(node, this.filepath, this.line)) {
        return transformerCategory.transform(node, this.filepath, this.line)
      }
    }
    throw new Error(`Unprocessable node: ${node.type}`)
  }

  private processSoftBreak(node: RemarkableNode): boolean {
    if (node.type !== "softbreak") {
      return false
    }
    this.line += 1
    return true
  }
}
