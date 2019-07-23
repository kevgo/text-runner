import { AbsoluteFilePath } from "../../../filesystem/absolute-file-path"
import { AstNodeList } from "../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../helpers/open-tag-tracker"
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
  private readonly transformerCategories: TransformerCategory[]

  constructor(
    filepath: AbsoluteFilePath,
    transformerCategories: TransformerCategory[]
  ) {
    this.filepath = filepath
    this.line = 1
    this.openTags = new OpenTagTracker()
    this.result = new AstNodeList()
    this.transformerCategories = transformerCategories
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
        return transformerCategory.transform(
          node,
          this.filepath,
          this.line,
          this.openTags
        )
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
