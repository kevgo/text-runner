// @flow

import type { Transformer } from '../standardize-ast/transformer.js'
import type { TransformerList } from '../standardize-ast/transformer-list.js'

const AstNodeList = require('../../ast-node-list.js')
const FormattingTracker = require('../helpers/formatting-tracker.js')
const getHtmlBlockTag = require('../helpers/get-html-block-tag.js')
const loadTransformers = require('../standardize-ast/load-transformers.js')
const OpenTagTracker = require('../helpers/open-tag-tracker.js')
const removeHtmlComments = require('../helpers/remove-html-comments.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

var mdTransformers: TransformerList = loadTransformers('md')
var htmlBlockTransformers: TransformerList = loadTransformers('htmlblock')
var htmlTagTransformers: TransformerList = loadTransformers('htmltag')

// AstStandardizer converts the AST created by Remarkable
// into the standardized AST used by TextRunner
module.exports = class AstStandardizer {
  filepath: string
  formattingTracker: FormattingTracker
  openTags: OpenTagTracker
  result: AstNodeList
  line: number

  constructor (filepath: string) {
    this.filepath = filepath
    this.openTags = new OpenTagTracker()
    this.result = new AstNodeList()
    this.line = 1
  }

  async standardize (ast: Object): Promise<AstNodeList> {
    for (let node of ast) {
      // console.log(node)
      if (node.lines) this.line = Math.max(node.lines[0] + 1, this.line)

      if (node.children) {
        for (let child of node.children) child.lines = node.lines
        await this.standardize(node.children)
        continue
      }

      if (this.processSoftBreak(node)) continue
      const processed = await this.processHtmlBlock(node)
      if (processed) continue
      if (this.processHtmlTag(node)) continue
      if (this.processMdNode(node)) continue
      alertUnknownNodeType(node, this.filepath, this.line)
    }
    return this.result
  }

  async processHtmlBlock (node: Object): Promise<boolean> {
    if (node.type !== 'htmlblock') return false
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      this.filepath,
      this.line
    )
    const transformer: Transformer = htmlBlockTransformers[tagName]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML block: '${tagName}'`,
        this.filepath,
        this.line
      )
    }
    const transformed = await transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const node of transformed) {
      this.result.push(node)
    }
    return true
  }

  processHtmlTag (node: Object): boolean {
    if (node.type !== 'htmltag') return false
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      this.filepath,
      this.line
    )
    const transformer: Transformer =
      htmlTagTransformers[tagName.replace('/', '_')]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML tag: '${tagName}'`,
        this.filepath,
        this.line
      )
    }
    const transformed = transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const node of transformed) {
      this.result.push(node)
    }
    return true
  }

  processMdNode (node: Object): boolean {
    const transformer: Transformer = mdTransformers[node.type]
    if (!transformer) return false
    const transformed = transformer(
      node,
      this.openTags,
      this.filepath,
      this.line
    )
    for (const node of transformed) {
      this.result.push(node)
    }
    return true
  }

  processSoftBreak (node: Object): boolean {
    if (node.type !== 'softbreak') return false
    this.line += 1
    return true
  }
}

function alertUnknownNodeType (node, filepath: string, line: number) {
  throw new UnprintedUserError(
    `AstStandardizer: unknown node type: ${node.type}`,
    filepath,
    line
  )
}
