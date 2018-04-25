// @flow

import type { AstNodeList } from '../../ast-node-list.js'
import type { Transformer } from './transformers/transformer.js'
import type { TransformerList } from './transformers/transformer-list.js'

const FormattingTracker = require('./helpers/formatting-tracker.js')
const getTagType = require('../../../../../helpers/get-tag-type.js')
const isClosingHtmlTagType = require('./helpers/is-closing-html-tag-type.js')
const loadTransformers = require('./transformers/load.js')
const OpenTagTracker = require('./helpers/open-tag-tracker.js')
const UnprintedUserError = require('../../../../../errors/unprinted-user-error.js')

var htmlTransformers: TransformerList = loadTransformers('html')
var mdTransformers: TransformerList = loadTransformers('md')

// AstStandardizer converts the AST created by Remarkable
// into the standardized AST used by TextRunner
module.exports = class AstStandardizer {
  filepath: string
  formattingTracker: FormattingTracker
  openTags: OpenTagTracker
  result: AstNodeList

  constructor (filepath: string) {
    this.filepath = filepath
    this.formattingTracker = new FormattingTracker()
    this.openTags = new OpenTagTracker()
    this.result = []
  }

  standardize (ast: Object, line: number = 0): AstNodeList {
    for (let node of ast) {
      const nodeLine = node.lines ? node.lines[0] + 1 : line
      this.processFormattingNode(node) ||
        this.processMdNode(node, nodeLine) ||
        this.processHtmlNode(node, nodeLine) ||
        this.processTextNode(node) ||
        alertUnknownNodeType(node, this.filepath, line)

      if (node.children) {
        this.standardize(node.children, nodeLine)
      }
    }
    return this.result
  }

  processFormattingNode (node: Object): boolean {
    return this.formattingTracker.register(node)
  }

  processHtmlNode (node: Object, line: number): boolean {
    if (node.type !== 'htmltag') return false
    const tagType = getTagType(node.content)
    const transformer = htmlTransformers[tagType]
    if (isClosingHtmlTagType(tagType) && !transformer) {
      alertUnknownNodeType(tagType, this.filepath, line)
    }
    if (transformer) {
      const transformed = transformer(
        this.openTags.popOpenTagFor(node.type),
        this.openTags,
        this.filepath,
        line
      )
      if (transformed) this.result.push(transformed)
    } else {
      this.openTags.add(node, this.filepath, line)
    }
    return true
  }

  processMdNode (node: Object, line: number): boolean {
    const transformer: Transformer = mdTransformers[node.type]
    if (!transformer) return false
    const transformed = transformer(node, this.openTags, this.filepath, line)
    if (transformed) this.result.push(transformed)
    return true
  }

  processTextNode (node: Object): boolean {
    if (node.type !== 'text') return false
    this.openTags.addText(node.content)
    return true
  }
}

function alertUnknownNodeType (node, filepath: string, line: number) {
  throw new UnprintedUserError(
    `Unknown node: ${JSON.stringify(node)}`,
    filepath,
    line
  )
}
