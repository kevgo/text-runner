// @flow

import type { AstNodeList } from '../../parsers/ast-node-list.js'

// $FlowFixMe
const Remarkable = require('remarkable')

type Heading = {
  lines: Array<number>,
  text: string
}

class MarkdownParser {
  // Parses Markdown files into an AstNode[]

  markdownParser: typeof Remarkable

  constructor() {
    this.markdownParser = new Remarkable('full', { html: true })
  }

  parse(markdownText: string): AstNodeList {
    return this._standardizeAst(this.markdownParser.parse(markdownText, {}))
  }

  _standardizeAst(
    ast,
    line: number = 0,
    result: AstNodeList = [],
    heading: ?Heading = undefined
  ): AstNodeList {
    const modifiers = []
    for (let node of ast) {
      const nodeLine = node.lines && node.lines.length > 0 ? node.lines[0] + 1 : line

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
          line: heading.lines[heading.lines.length - 1],
          type: 'heading',
          content: heading.text,
          level: node.hLevel
        })
        heading = null
      } else if (isHtmlImageTag(node)) {
        result.push({ line: nodeLine, type: 'image', src: htmlImageTagSrc(node) })
      } else if (node.type === 'image') {
        result.push({ line: nodeLine, type: 'image', src: node.src })
      } else if (heading && node.type === 'text') {
        heading.text += node.content
      } else if (
        ['code', 'fence', 'htmlblock', 'htmltag', 'link_open', 'text'].indexOf(node.type) > -1
      ) {
        result.push({
          line: nodeLine,
          type: `${modifiers.sort().join()}${node.type}`,
          content: node.content || node.href
        })
      }

      if (node.children) {
        this._standardizeAst(node.children, nodeLine, result, heading)
      }
    }

    return result
  }
}

// Returns whether this AST node represents an HTML tag
function isHtmlImageTag(node) {
  return node.type === 'htmltag' && /<img [^>]*src=".*?".*?>/.test(node.content)
}

function htmlImageTagSrc(node) {
  const matches = node.content.match(/<img.*src="([^"]*)".*>/)
  return matches[1]
}

module.exports = MarkdownParser
