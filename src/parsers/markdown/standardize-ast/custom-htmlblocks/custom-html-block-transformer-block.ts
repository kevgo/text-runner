import { AbsoluteFilePath } from '../../../../domain-model/absolute-file-path'
import { UnprintedUserError } from '../../../../errors/unprinted-user-error'
import { AstNodeList } from '../../../ast-node-list'
import { getHtmlBlockTag } from '../../helpers/get-html-block-tag'
import { OpenTagTracker } from '../../helpers/open-tag-tracker'
import { removeHtmlComments } from '../../helpers/remove-html-comments'
import { loadTransformers } from '../load-transformers'
import { RemarkableNode } from '../remarkable-node'
import { TransformerList } from '../transformer-list'

export class CustomHtmlBlockTransformerBlock {
  openTags: OpenTagTracker
  transformers: TransformerList

  constructor(openTags: OpenTagTracker) {
    this.openTags = openTags
    this.transformers = {}
  }

  canTransform(node: RemarkableNode): boolean {
    return node.type === 'htmlblock'
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
