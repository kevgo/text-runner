// @flow

import type { AstNodeList } from '../../ast-node-list.js'
import type { Transformer } from '../../transformers/transformer.js'

const getTagType = require('../../../../../helpers/get-tag-type.js')
const loadTransformers = require('../../transformers/load.js')
const FormattingTracker = require('./formatting-tracker.js')
const OpenTagTracker = require('./open-tag-tracker.js')
// $FlowFixMe
const Remarkable = require('remarkable')
const UnprintedUserError = require('../../../../../errors/unprinted-user-error.js')

const markdownParser = new Remarkable('full', { html: true })

const htmlTransformers = loadTransformers('html')
const mdTransformers = loadTransformers('md')

// Parses Markdown files into an AstNode[]
function parseMarkdown (markdownText: string, filepath: string): AstNodeList {
  const raw = markdownParser.parse(markdownText, {})
  const astStandardizer = new AstStandardizer(filepath)
  return astStandardizer(raw, filepath)
}

// AstStandardizer converts the AST created by Remarkable
// into the standardized AST used by TextRunner
class AstStandardizer {
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

  standardize (ast, line: number = 0): AstNodeList {
    for (let node of ast) {
      const nodeLine = node.lines ? node.lines[0] + 1 : line
      var processed = false

      if (this.processFormattingNode(node)) processed = true
      if (this.processMdNode(node)) processed = true
      if (this.processHtmlNode(node)) processed = true
      if (this.processTextNode(node, nodeLine)) processed = true
      if (node.children) {
        this.standardize(node.children, filepath, nodeLine)
      }

      if (!processed) {
        alertUnknownNodeType(node, this.filepath, line)
      }
    }
  }

  processFormattingNode (node): boolean {
    return this.formattingTracker.register(node)
  }

  processTextNode (node): boolean {
    if (node.type !== 'text') return false
    this.openTags.addText(node.content)
    return true
  }

  processMdNode (node): boolean {
    const transformer = mdTransformers[node.type]
    if (!transformer) return false
    this.result.push(transformer(node))
    return true
  }

  processHtmlNode (node): boolean {
    if (node.type !== 'htmltag') return false
    const tagType = getTagType(node.content)
    const transformer = htmlTransformers[tagType]
    if (isClosingHtmlTag(tagType) && !transformer) {
      alertUnknownNodeType(tagType, this.filepath, line)
    }
    if (transformer) {
      this.result.push(transformer(this.openTags.getOpenTagFor(node)))
    } else {
      this.openTags.add(node)
    }
    return true
  }
}

function alertUnknownNodeType (node, filepath: string, line: number) {
  throw new UnprintedUserError(`Unknown node: ${node}`, filepath, line)
}

module.exports = parseMarkdown
