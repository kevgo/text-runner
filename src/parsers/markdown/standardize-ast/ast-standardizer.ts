import { AbsoluteFilePath } from '../../../domain-model/absolute-file-path'
import { AstNodeList } from '../../ast-node-list'
import { OpenTagTracker } from '../helpers/open-tag-tracker'
import { CustomHtmlTagTransformerBlock } from './custom-html-tags/custom-html-tag-transformer-block'
import { CustomHtmlBlockTransformerBlock } from './custom-htmlblocks/custom-html-block-transformer-block'
import { CustomMdTransformerBlock } from './custom-md/custom-md-transformer-block'
import { GenericHtmlTagTransformerBlock } from './generic-htmltags/generic-html-tag-transformer-block'
import { GenericMdTransformerBlock } from './generic-md/generic-md-transformer-block'
import { RemarkableNode } from './remarkable-node'
import { TagMapper } from './tag-mapper'

/**
 * AstStandardizer converts the AST created by Remarkable
 * into the standardized AST used by TextRunner
 */
export default class AstStandardizer {
  // data about the current AST transformation operation
  filepath: AbsoluteFilePath
  line: number
  openTags: OpenTagTracker
  result: AstNodeList
  tagMapper: TagMapper

  // transformer blocks
  customHtmlBlockTransformerBlock: CustomHtmlBlockTransformerBlock
  customHtmlTagTransformerBlock: CustomHtmlTagTransformerBlock
  customMdTransformerBlock: CustomMdTransformerBlock
  genericHtmlTagTransformerBlock: GenericHtmlTagTransformerBlock
  genericMdTransformerBlock: GenericMdTransformerBlock

  constructor(filepath: AbsoluteFilePath) {
    // data about the current transformation operation
    this.filepath = filepath
    this.line = 1
    this.openTags = new OpenTagTracker()
    this.tagMapper = new TagMapper()
    this.result = new AstNodeList()

    // transformer blocks
    this.customHtmlBlockTransformerBlock = new CustomHtmlBlockTransformerBlock(
      this.openTags
    )
    this.customHtmlTagTransformerBlock = new CustomHtmlTagTransformerBlock(
      this.openTags
    )
    this.customMdTransformerBlock = new CustomMdTransformerBlock(this.openTags)
    this.genericHtmlTagTransformerBlock = new GenericHtmlTagTransformerBlock(
      this.openTags,
      this.tagMapper
    )
    this.genericMdTransformerBlock = new GenericMdTransformerBlock(
      this.openTags,
      this.tagMapper
    )
  }

  async loadTransformers() {
    await this.customMdTransformerBlock.loadTransformers()
    await this.customHtmlBlockTransformerBlock.loadTransformers()
    await this.customHtmlTagTransformerBlock.loadTransformers()
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
      if (this.customHtmlBlockTransformerBlock.canTransform(node)) {
        await this.processHtmlBlock(node)
        continue
      }
      if (
        this.customHtmlTagTransformerBlock.canTransform(
          node,
          this.filepath,
          this.line
        )
      ) {
        await this.processCustomHtmlTag(node)
        continue
      }
      if (this.genericHtmlTagTransformerBlock.canTransform(node)) {
        await this.processGenericHtmlTag(node)
        continue
      }
      if (this.customMdTransformerBlock.canTransform(node)) {
        await this.processCustomMdNode(node)
        continue
      }
      if (this.genericMdTransformerBlock.canTransform(node)) {
        await this.processGenericMdNode(node)
        continue
      }
      throw new Error(`Unprocessable node: ${node.type}`)
    }
    return this.result
  }

  async processGenericHtmlTag(node: RemarkableNode) {
    const transformed = await this.genericHtmlTagTransformerBlock.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
  }

  async processHtmlBlock(node: RemarkableNode) {
    const transformed = await this.customHtmlBlockTransformerBlock.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
  }

  async processCustomHtmlTag(node: RemarkableNode) {
    const transformed = await this.customHtmlTagTransformerBlock.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
  }

  async processGenericMdNode(node: RemarkableNode) {
    const transformed = await this.genericMdTransformerBlock.transform(
      node,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
    return true
  }

  async processCustomMdNode(node: any) {
    const transformed = await this.customMdTransformerBlock.transform(
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
