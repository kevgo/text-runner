// @flow

import type { AstNode } from '../../ast-node.js'
import type { AstNodeList } from '../../ast-node-list.js'

type Heading = {
  type: string, // h1, h2, etc
  line: number,
  text: string, // textual content of the heading
  attributes: { [string]: string } // HTML attributes of the heading
}

const getTagType = require('../../../../../helpers/get-tag-type.js')
const isHtmlImageTag = require('./is-html-image-tag.js')
const parseAttributes = require('./parse-attributes.js')
// $FlowFixMe
const Remarkable = require('remarkable')
const UnprintedUserError = require('../../../../../errors/unprinted-user-error.js')

const markdownParser = new Remarkable('full', { html: true })

// Parses Markdown files into an AstNode[]
function parseMarkdown (markdownText: string, filepath: string): AstNodeList {
  const raw = markdownParser.parse(markdownText, {})
  return standardizeAst(raw, filepath)
}

function standardizeAst (
  ast,
  filepath: string,
  line: number = 0,
  result: AstNodeList = [],
  heading: ?Heading = undefined
): AstNodeList {
  const modifiers = []
  for (let node of ast) {
    const nodeLine = node.lines ? node.lines[0] + 1 : line

    if (node.type === 'em_open') {
      modifiers.push('emphasized')
    } else if (node.type === 'em_close') {
      modifiers.splice(modifiers.indexOf('emphasized'), 1)
    } else if (node.type === 'strong_open') {
      modifiers.push('strong')
    } else if (node.type === 'strong_close') {
      modifiers.splice(modifiers.indexOf('strong'), 1)
    } else if (isMarkdownHeadingOpen(node)) {
      heading = {
        type: `h${node.hLevel}`,
        line: nodeLine,
        text: '',
        attributes: {}
      }
    } else if (isHtmlHeadingOpen(node)) {
      verifyNotInHeading(heading, node, nodeLine)
      heading = {
        type: getTagType(node.content),
        line: nodeLine,
        text: '',
        attributes: parseAttributes(node.content, filepath, nodeLine)
      }
    } else if (heading && isHeadingClose(node)) {
      result.push({
        type: heading.type,
        filepath: filepath,
        line: heading.line,
        content: heading.text,
        attributes: heading.attributes
      })
      heading = null
    } else if (isHtmlImageTag(node)) {
      result.push({
        type: 'image',
        filepath: filepath,
        line: nodeLine,
        content: '',
        attributes: parseAttributes(node.content, filepath, nodeLine),
        html: node.content
      })
    } else if (node.type === 'image') {
      result.push({
        type: 'image',
        filepath: filepath,
        line: nodeLine,
        content: '', // TODO
        attributes: {
          src: node.src
        }
      })
    } else if (heading && node.type === 'text') {
      heading.text += node.content
    } else if (isInterestingTag(node.type)) {
      result.push({
        type: `${modifiers.sort().join()}${node.type}`,
        filepath: filepath,
        line: nodeLine,
        content: node.content || node.href,
        attributes: {}
      })
    }

    if (node.children) {
      standardizeAst(node.children, filepath, nodeLine, result, heading)
    }
  }

  return result
}

function getLastLine (lines: number | number[]): number {
  if (typeof lines === 'number') {
    return lines
  } else {
    return lines[lines.length - 1]
  }
}

const htmlHeadingCloseRegex = /<\/h[1-6]>/
function isHeadingClose (node: AstNode): boolean {
  return (
    node.type === 'heading_close' || htmlHeadingCloseRegex.test(node.content)
  )
}

const headingHtmlTagRegex = /<h[1-6].*>/
function isHtmlHeadingOpen (node: AstNode): boolean {
  return node.type === 'htmltag' && headingHtmlTagRegex.test(node.content)
}

function isMarkdownHeadingOpen (node: AstNode): boolean {
  return node.type === 'heading_open'
}

function isInterestingTag (tagName: string): boolean {
  return [
    'code',
    'fence',
    'htmlblock',
    'htmltag',
    'link_open',
    'text'
  ].includes(tagName)
}

function verifyNotInHeading (heading: ?Heading, node: AstNode, line: number) {
  if (heading) {
    throw new UnprintedUserError(
      `nested heading found: ${node.content}`,
      node.filepath,
      line
    )
  }
}

module.exports = parseMarkdown
