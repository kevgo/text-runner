import { AbsoluteFilePath } from '../../../domain-model/absolute-file-path'
import { AstNodeList } from '../../ast-node-list'
import { OpenTagTracker } from '../helpers/open-tag-tracker'
import { CustomHtmlTagTransformer } from './custom-html-tags/custom-html-tag-transformer'
import { CustomHtmlBlockTransformer } from './custom-htmlblocks/custom-html-block-transformer'
import { CustomMdTransformer } from './custom-md/custom-md-transformer'
import { GenericHtmlTagTransformer } from './generic-htmltags/generic-html-tag-transformer'
import { GenericMdTransformer } from './generic-md/generic-md-transformer'
import { RemarkableNode } from './remarkable-node'
import { TagMapper } from './tag-mapper'
import { TransformerList } from './transformer-list'

/**
 * AstStandardizer converts the AST created by Remarkable
 * into the standardized AST used by TextRunner
 */
export default class AstStandardizer {
  customHtmlBlockTransformer: CustomHtmlBlockTransformer
  customHtmlTagTransformer: CustomHtmlTagTransformer
  customMdTransformer: CustomMdTransformer
  filepath: AbsoluteFilePath
  genericHtmlTagTransformer: GenericHtmlTagTransformer
  genericMdTransformer: GenericMdTransformer
  htmlBlockTransformers: TransformerList
  line: number
  openTags: OpenTagTracker
  result: AstNodeList
  tagMapper: TagMapper

  constructor(filepath: AbsoluteFilePath) {
    this.openTags = new OpenTagTracker()
    this.tagMapper = new TagMapper()
    this.customHtmlBlockTransformer = new CustomHtmlBlockTransformer(
      this.openTags
    )
    this.customHtmlTagTransformer = new CustomHtmlTagTransformer(this.openTags)
    this.customMdTransformer = new CustomMdTransformer(this.openTags)
    this.filepath = filepath
    this.genericHtmlTagTransformer = new GenericHtmlTagTransformer(
      this.openTags,
      this.tagMapper
    )
    this.genericMdTransformer = new GenericMdTransformer(
      this.openTags,
      this.tagMapper
    )
    this.htmlBlockTransformers = {}
    this.line = 1
    this.result = new AstNodeList()
  }

  async loadTransformers() {
    await this.customMdTransformer.loadTransformers()
    await this.customHtmlBlockTransformer.loadTransformers()
    await this.customHtmlTagTransformer.loadTransformers()
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
      if (this.customHtmlBlockTransformer.canTransform(node)) {
        await this.processHtmlBlock(node)
        continue
      }
      if (
        this.customHtmlTagTransformer.canTransform(
          node,
          this.filepath,
          this.line
        )
      ) {
        this.processCustomHtmlTag(node)
        continue
      }
      if (this.genericHtmlTagTransformer.canTransform(node)) {
        this.processGenericHtmlTag(node)
        continue
      }
      if (this.customMdTransformer.canTransform(node)) {
        this.processCustomMdNode(node)
        continue
      }
      if (this.genericMdTransformer.canTransform(node)) {
        this.processGenericMdNode(node)
        continue
      }
      throw new Error(`Unprocessable node: ${node.type}`)
    }
    return this.result
  }

  processGenericHtmlTag(node: RemarkableNode) {
    const transformed = this.genericHtmlTagTransformer.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
  }

  async processHtmlBlock(node: RemarkableNode) {
    const transformed = await this.customHtmlBlockTransformer.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
  }

  processCustomHtmlTag(node: RemarkableNode) {
    const transformed = this.customHtmlTagTransformer.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
  }

  processGenericMdNode(node: RemarkableNode): boolean {
    const transformed = this.genericMdTransformer.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
    return true
  }

  processCustomMdNode(node: any): boolean {
    const transformed = this.customMdTransformer.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
    return true
  }

  processSoftBreak(node: RemarkableNode): boolean {
    if (node.type !== 'softbreak') {
      return false
    }
    this.line += 1
    return true
  }
}
