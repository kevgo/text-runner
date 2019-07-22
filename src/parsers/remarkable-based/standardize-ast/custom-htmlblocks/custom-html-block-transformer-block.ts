import { UnprintedUserError } from "../../../../errors/unprinted-user-error"
import { AbsoluteFilePath } from "../../../../finding-files/absolute-file-path"
import { AstNodeList } from "../../../standard-AST/ast-node-list"
import { getHtmlBlockTag } from "../../helpers/get-html-block-tag"
import { OpenTagTracker } from "../../helpers/open-tag-tracker"
import { removeHtmlComments } from "../../helpers/remove-html-comments"
import { loadTransformers } from "../load-transformers"
import { RemarkableNode } from "../types/remarkable-node"
import { TransformerBlock } from "../types/transformer-block"
import { TransformerList } from "../types/transformer-list"

export class CustomHtmlBlockTransformerBlock implements TransformerBlock {
  private readonly openTags: OpenTagTracker
  private transformers: TransformerList

  constructor(openTags: OpenTagTracker) {
    this.openTags = openTags
    this.transformers = {}
  }

  canTransform(node: RemarkableNode): boolean {
    return node.type === "htmlblock"
  }

  async loadTransformers() {
    this.transformers = await loadTransformers(__dirname)
  }

  async transform(
    node: RemarkableNode,
    file: AbsoluteFilePath,
    line: number
  ): Promise<AstNodeList> {
    const cleanedContent = removeHtmlComments(node.content)
    const tagName = getHtmlBlockTag(cleanedContent, file, line)
    const transformer = this.transformers[tagName]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML block: '${tagName}'`,
        file.platformified(),
        line
      )
    }
    const transformed = await transformer(node, this.openTags, file, line)
    return transformed
  }
}
