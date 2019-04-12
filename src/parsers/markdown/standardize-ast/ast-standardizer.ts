import { AbsoluteFilePath } from '../../../domain-model/absolute-file-path'
import { UnprintedUserError } from '../../../errors/unprinted-user-error'
import { AstNodeList } from '../../ast-node-list'
import { getHtmlBlockTag } from '../helpers/get-html-block-tag'
import { OpenTagTracker } from '../helpers/open-tag-tracker'
import { removeHtmlComments } from '../helpers/remove-html-comments'
import { loadTransformers } from '../standardize-ast/load-transformers'
import { GenericMdTransformer } from './generic-md-transformer'
import { TransformerList } from './transformer-list'

/**
 * AstStandardizer converts the AST created by Remarkable
 * into the standardized AST used by TextRunner
 */
export default class AstStandardizer {
  filepath: AbsoluteFilePath
  openTags: OpenTagTracker
  result: AstNodeList
  line: number
  genericMdTransformer: GenericMdTransformer
  mdTransformers: TransformerList
  htmlBlockTransformers: TransformerList
  htmlTagTransformers: TransformerList

  constructor(filepath: AbsoluteFilePath) {
    this.filepath = filepath
    this.openTags = new OpenTagTracker()
    this.result = new AstNodeList()
    this.line = 1
    this.genericMdTransformer = new GenericMdTransformer(this.openTags)
    this.mdTransformers = {}
    this.htmlBlockTransformers = {}
    this.htmlTagTransformers = {}
  }

  async loadTransformers() {
    this.mdTransformers = await loadTransformers('md')
    this.htmlBlockTransformers = await loadTransformers('htmlblock')
    this.htmlTagTransformers = await loadTransformers('htmltag')
  }

  async standardize(ast: any): Promise<AstNodeList> {
    for (const node of ast) {
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
      if (await this.processHtmlBlock(node)) {
        continue
      }
      if (this.processHtmlTag(node)) {
        continue
      }
      if (this.processCustomMdNode(node)) {
        continue
      }
      this.processGenericMdNode(node)
    }
    return this.result
  }

  async processHtmlBlock(node: any): Promise<boolean> {
    if (node.type !== 'htmlblock') {
      return false
    }
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      this.filepath,
      this.line
    )
    const transformer = this.htmlBlockTransformers[tagName]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML block: '${tagName}'`,
        this.filepath.platformified(),
        this.line
      )
    }
    const transformed = await transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
    return true
  }

  processHtmlTag(node: any): boolean {
    if (node.type !== 'htmltag') {
      return false
    }
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      this.filepath,
      this.line
    )
    const transformer = this.htmlTagTransformers[tagName.replace('/', '_')]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML tag: '${tagName}'`,
        this.filepath.platformified(),
        this.line
      )
    }
    const transformed = transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
    return true
  }

  processGenericMdNode(node: any): boolean {
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
    const transformer = this.mdTransformers[node.type]
    if (!transformer) {
      return false
    }
    const transformed = transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const transformedNode of transformed) {
      this.result.push(transformedNode)
    }
    return true
  }

  processSoftBreak(node: any): boolean {
    if (node.type !== 'softbreak') {
      return false
    }
    this.line += 1
    return true
  }
}
