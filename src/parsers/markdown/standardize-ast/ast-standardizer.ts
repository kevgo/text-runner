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

      const transformed = await this.transform(node)
      for (const transformedNode of transformed) {
        this.result.push(transformedNode)
      }
    }
    return this.result
  }

  async transform(node: RemarkableNode): Promise<AstNodeList> {
    if (this.customHtmlBlockTransformerBlock.canTransform(node)) {
      return this.customHtmlBlockTransformerBlock.transform(
        node,
        this.filepath,
        this.line
      )
    }
    if (
      this.customHtmlTagTransformerBlock.canTransform(
        node,
        this.filepath,
        this.line
      )
    ) {
      return this.customHtmlTagTransformerBlock.transform(
        node,
        this.filepath,
        this.line
      )
    }
    if (this.genericHtmlTagTransformerBlock.canTransform(node)) {
      return this.genericHtmlTagTransformerBlock.transform(
        node,
        this.filepath,
        this.line
      )
    }
    if (this.customMdTransformerBlock.canTransform(node)) {
      return this.customMdTransformerBlock.transform(
        node,
        this.filepath,
        this.line
      )
    }
    if (this.genericMdTransformerBlock.canTransform(node)) {
      return this.genericMdTransformerBlock.transform(
        node,
        this.filepath,
        this.line
      )
    }
    throw new Error(`Unprocessable node: ${node.type}`)
  }

  processSoftBreak(node: RemarkableNode): boolean {
    if (node.type !== 'softbreak') {
      return false
    }
    this.line += 1
    return true
  }
}
