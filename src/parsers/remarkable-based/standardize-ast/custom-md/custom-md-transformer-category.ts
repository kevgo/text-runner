import { AbsoluteFilePath } from "../../../../filesystem/absolute-file-path"
import { AstNodeList } from "../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../helpers/open-tag-tracker"
import { loadTransformers } from "../load-transformers"
import { RemarkableNode } from "../types/remarkable-node"
import { TransformerCategory } from "../types/transformer-category"
import { TransformerList } from "../types/transformer-list"

export class CustomMdTransformerCategory implements TransformerCategory {
  private mdTransformers: TransformerList

  constructor() {
    this.mdTransformers = {}
  }

  async loadTransformers() {
    this.mdTransformers = await loadTransformers(__dirname)
  }

  canTransform(node: RemarkableNode): boolean {
    return this.mdTransformers.hasOwnProperty(node.type)
  }

  async transform(
    node: RemarkableNode,
    file: AbsoluteFilePath,
    line: number,
    openTags: OpenTagTracker
  ): Promise<AstNodeList> {
    const transformer = this.mdTransformers[node.type]
    return transformer(node, openTags, file, line)
  }
}
