import { AbsoluteFilePath } from '../../../../domain-model/absolute-file-path'
import { AstNodeList } from '../../../ast-node-list'
import { OpenTagTracker } from '../../helpers/open-tag-tracker'
import { loadTransformers } from '../load-transformers'
import { TransformerList } from '../transformer-list'

export class CustomMdTransformer {
  mdTransformers: TransformerList
  openTags: OpenTagTracker

  constructor(openTags: OpenTagTracker) {
    this.mdTransformers = {}
    this.openTags = openTags
  }

  async loadTransformers() {
    this.mdTransformers = await loadTransformers('md')
  }

  canTransform(node: any): boolean {
    return this.mdTransformers.hasOwnProperty(node.type)
  }

  transform(node: any, file: AbsoluteFilePath, line: number): AstNodeList {
    const transformer = this.mdTransformers[node.type]
    return transformer(node, this.openTags, file, line)
  }
}
