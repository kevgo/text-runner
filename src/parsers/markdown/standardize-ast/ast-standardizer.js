// @flow

import type { Transformer } from '../standardize-ast/transformer.js'
import type { TransformerList } from '../standardize-ast/transformer-list.js'

const AstNode = require('../../ast-node.js')
const AstNodeList = require('../../ast-node-list.js')
const FormattingTracker = require('../helpers/formatting-tracker.js')
const getHtmlBlockTag = require('../helpers/get-html-block-tag.js')
const isClosingHtmlTagType = require('../helpers/is-closing-html-tag-type.js')
const isOpeningHtmlTagType = require('../helpers/is-opening-html-tag-type.js')
const isSingleHtmlTagType = require('../helpers/is-single-html-tag-type.js')
const loadMdTransformers = require('../standardize-ast/load-md-transformers.js')
const loadHtmlBlockTransformers = require('../standardize-ast/load-htmlblock-transformers.js')
const openingTagFor = require('../helpers/opening-tag-for.js')
const OpenTagTracker = require('../helpers/open-tag-tracker.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')
const parseHtmlTag = require('../helpers/parse-html-tag.js')

var mdTransformers: TransformerList = loadMdTransformers()
var htmlBlockTransformers: TransformerList = loadHtmlBlockTransformers()

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
    const tag = getHtmlBlockTag(node.content, this.filepath, this.line)
    const transformer: Transformer = htmlBlockTransformers[tag]
    if (!transformer) {
      throw new UnprintedUserError(
        `Unknown HTML block: '${tag}'`,
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
    const [tag, attributes] = parseHtmlTag(
      node.content,
      this.filepath,
      this.line
    )
    const type = this.getType(tag, attributes)
    const astNode = new AstNode({
      type,
      tag,
      content: '',
      line: this.line,
      file: this.filepath,
      attributes
    })
    if (isSingleHtmlTagType(tag)) {
      // nothing to do here
    } else if (isOpeningHtmlTagType(tag)) {
      this.openTags.add(astNode)
    } else if (isClosingHtmlTagType(tag)) {
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

  getType (tag: string, attributes: { [string]: string }): string {
    if (tag === 'a' && attributes['href']) return 'link_open'
    if (tag === '/a' && this.openTags.peek().attributes['href']) {
      return 'link_close'
    }
    const result = types[tag]
    if (!result) {
      throw new UnprintedUserError(
        `unknown HTML tag type: '${tag}'`,
        this.filepath,
        this.line
      )
    }
    return result
  }
}

const types = {
  br: 'linebreak',
  h1: 'heading_open',
  '/h1': 'heading_close',
  h2: 'heading_open',
  '/h2': 'heading_close',
  h3: 'heading_open',
  '/h3': 'heading_close',
  h4: 'heading_open',
  '/h4': 'heading_close',
  h5: 'heading_open',
  '/h5': 'heading_close',
  h6: 'heading_open',
  '/h6': 'heading_close',
  img: 'image',
  code: 'code_open',
  '/code': 'code_close',
  a: 'anchor_open',
  '/a': 'anchor_close',
  strong: 'strong_open',
  '/strong': 'strong_close',
  em: 'em_open',
  '/em': 'em_close'
}

function alertUnknownNodeType (node, filepath: string, line: number) {
  throw new UnprintedUserError(
    `AstStandardizer: unknown node type: ${node.type}`,
    filepath,
    line
  )
}
