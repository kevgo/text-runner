// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')

// A node in the standardized Markdown/HTML AST
module.exports = class AstNode {
  type: string // markdown type of AST node
  tag: string // HTML type of AST node
  file: AbsoluteFilePath // the file in which this AstNode occurs
  line: number // the line in the file at which this AST node occurs
  content: string // textual content of this AST node
  attributes: { [string]: string } // the attributes of the node

  constructor (data: {
  type: string,
  tag: string,
  file: AbsoluteFilePath,
  line: number,
  content: string,
  attributes: { [string]: string }
  }) {
    this.type = data.type
    this.tag = data.tag
    this.file = data.file
    this.line = data.line
    this.content = data.content
    this.attributes = data.attributes
  }

  // Returns the type of the corresponding ending node
  endType (): string {
    if (!this.isOpeningNode()) throw new Error('not an opening node')
    return this.type.replace('open', '') + 'close'
  }

  htmlLinkTarget (): ?string {
    if (this.content == null) return null
    if (this.type !== 'htmltag') return null
    const matches = this.content.match(/<a[^>]*href="([^"]*)".*?>/)
    return matches ? matches[1] : null
  }

  isOpeningNode (): boolean {
    return this.type.endsWith('_open')
  }

  isClosingNode (): boolean {
    return this.type.endsWith('_close')
  }

  static scaffold (data: Object = {}): AstNode {
    if (typeof data.file === 'string') {
      data.file = new AbsoluteFilePath(data.file)
    }
    return new AstNode({
      type: data.type || 'type',
      tag: data.tag != null ? data.tag : 'tag',
      file: data.file || new AbsoluteFilePath('file'),
      line: data.line || 1,
      content: data.content || '',
      attributes: data.attributes || {}
    })
  }
}
