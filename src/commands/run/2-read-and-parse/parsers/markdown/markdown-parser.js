// @flow

import type { AstNodeList } from '../../ast-node-list.js'

const isHtmlImageTag = require('./is-html-image-tag.js')
const htmlImageTagSrc = require('./html-image-tag-src.js')
const parseAttributes = require('./parse-attributes.js')
// $FlowFixMe
const Remarkable = require('remarkable')

type Heading = {
  lines: Array<number>,
  text: string
}

class MarkdownParser {
  // Parses Markdown files into an AstNode[]

  markdownParser: typeof Remarkable

  constructor () {
    this.markdownParser = new Remarkable('full', { html: true })
  }

  parse (markdownText: string, filepath: string): AstNodeList {
    return this._standardizeAst(
      this.markdownParser.parse(markdownText, {}),
      filepath
    )
  }

  _standardizeAst (
    ast,
    filepath: string,
    line: number = 0,
    result: AstNodeList = [],
    heading: ?Heading = undefined
  ): AstNodeList {
    const modifiers = []
    for (let node of ast) {
      const nodeLine =
        node.lines && node.lines.length > 0 ? node.lines[0] + 1 : line

      if (node.type === 'em_open') {
        modifiers.push('emphasized')
      } else if (node.type === 'em_close') {
        modifiers.splice(modifiers.indexOf('emphasized'), 1)
      } else if (node.type === 'strong_open') {
        modifiers.push('strong')
      } else if (node.type === 'strong_close') {
        modifiers.splice(modifiers.indexOf('strong'), 1)
      } else if (node.type === 'heading_open') {
        heading = { lines: node.lines, text: '' }
      } else if (node.type === 'heading_close' && heading) {
        result.push({
          type: `h${node.hLevel}`,
          filepath: filepath,
          line: heading.lines[heading.lines.length - 1],
          content: heading.text || ''
        })
        heading = null
      } else if (isHtmlImageTag(node)) {
        result.push({
          type: 'image',
          filepath: filepath,
          line: nodeLine,
          content: '',
          attributes: parseAttributes(node.content, filepath, nodeLine), // TODO
          html: node.content
        })
      } else if (node.type === 'image') {
        result.push({
          type: 'image',
          filepath: filepath,
          line: nodeLine,
          src: node.src,
          content: '', // TODO
          attributes: {} // TODO
        })
      } else if (heading && node.type === 'text') {
        heading.text += node.content
      } else if (
        ['code', 'fence', 'htmlblock', 'htmltag', 'link_open', 'text'].includes(
          node.type
        )
      ) {
        result.push({
          type: `${modifiers.sort().join()}${node.type}`,
          filepath: filepath,
          line: nodeLine,
          content: node.content || node.href
        })
      }

      if (node.children) {
        this._standardizeAst(node.children, filepath, nodeLine, result, heading)
      }
    }

    return result
  }
}

module.exports = MarkdownParser
