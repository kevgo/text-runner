// @flow

import type { AstNodeList } from '../ast-node-list.js'
import type { Transformer } from './transformers/transformer.js'
import type { TransformerList } from './transformers/transformer-list.js'

const FormattingTracker = require('./helpers/formatting-tracker.js')
const isOpeningHtmlTagType = require('./helpers/is-opening-html-tag-type.js')
const loadTransformers = require('./transformers/load.js')
const openingTagFor = require('./helpers/opening-tag-for.js')
const OpenTagTracker = require('./helpers/open-tag-tracker.js')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')
const parseHtmlTag = require('../../helpers/parse-html-tag.js')

var mdTransformers: TransformerList = loadTransformers('md')

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
    this.result = []
    this.line = 1
  }

  standardize (ast: Object): AstNodeList {
    for (let node of ast) {
      if (node.lines) this.line = Math.max(node.lines[0] + 1, this.line)
      this.processSoftBreak(node) ||
        this.processMdNode(node) ||
        this.processHtmlNode(node) ||
        alertUnknownNodeType(node, this.filepath, this.line)

      if (node.children) {
        for (let child of node.children) child.lines = node.lines
        this.standardize(node.children)
      }
    }
    return this.result
  }

  processHtmlNode (node: Object): boolean {
    if (node.type !== 'htmltag') return false
    if (node.type === 'softbreak') this.line += 1
    const [tag, attributes] = parseHtmlTag(
      node.content,
      this.filepath,
      this.line
    )
    const type = getType(tag)
    const astNode = {
      type,
      tag,
      content: '',
      line: this.line,
      file: this.filepath,
      attributes
    }
    if (isOpeningHtmlTagType(tag)) {
      this.openTags.add(astNode)
    } else {
      const openingNode = this.openTags.pop(openingTagFor(astNode.type))
      astNode.attributes = openingNode.attributes
    }
    this.result.push(astNode)
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
    this.result = this.result.concat(transformed)
    return true
  }

  processSoftBreak (node: Object): boolean {
    if (node.type !== 'softbreak') return false
    this.line += 1
    return true
  }
}

const types = {
  h1: 'heading_open',
  '/h1': 'heading_close',
  img: 'image',
  code: 'code_open',
  '/code': 'code_close',
  a: 'anchor_open',
  '/a': 'anchor_close'
}
function getType (tag: string): string {
  const result = types[tag]
  if (!result) {
    throw new UnprintedUserError(`AstStandardizer: unknown tag type: '${tag}'`)
  }
  return result
}

function alertUnknownNodeType (node, filepath: string, line: number) {
  throw new UnprintedUserError(
    `AstStandardizer: unknown node type: ${node.type}`,
    filepath,
    line
  )
}
