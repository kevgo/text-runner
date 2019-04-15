import { AbsoluteFilePath } from '../../../../domain-model/absolute-file-path'
import { AstNodeList } from '../../../ast-node-list'
import { getHtmlBlockTag } from '../../helpers/get-html-block-tag'
import { OpenTagTracker } from '../../helpers/open-tag-tracker'
import { removeHtmlComments } from '../../helpers/remove-html-comments'
import { loadTransformers } from '../load-transformers'
import { RemarkableNode } from '../remarkable-node'
import { TransformerList } from '../transformer-list'

export class CustomHtmlTagTransformerBlock {
  htmlTagTransformers: TransformerList
  openTags: OpenTagTracker

  constructor(openTags: OpenTagTracker) {
    this.htmlTagTransformers = {}
    this.openTags = openTags
  }

  async loadTransformers() {
    this.htmlTagTransformers = await loadTransformers(__dirname)
  }

  /** Returns whether this transformer can transform the given Remarkable node */
  canTransform(node: RemarkableNode, filepath, line): boolean {
    if (node.type !== 'htmltag') {
      return false
    }
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      filepath,
      line
    )
    const filename = this.transformerFileName(tagName)
    return this.htmlTagTransformers.hasOwnProperty(filename)
  }

  /** Transforms the given node into an AstNodeList and signals success */
  transform(
    node: RemarkableNode,
    filepath: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      filepath,
      line
    )
    const transformer = this.htmlTagTransformers[tagName.replace('/', '_')]
    return transformer(node, this.openTags, filepath, line)
  }

  /** Returns the filename that the transformer for the given RemarkableType can be found at */
  private transformerFileName(type: string): string {
    return type.replace('/', '_')
  }
}
