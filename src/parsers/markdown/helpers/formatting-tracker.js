// @flow

const AstNode = require('../../ast-node.js')

// FormattingTracker tracks formatting nodes
// like 'em' and 'strong'
module.exports = class FormattingTracker {
  tags: string[]

  constructor () {
    this.tags = []
  }

  register (node: AstNode): boolean {
    var result = true
    if (node.type === 'em_open') this.open('emphasized')
    else if (node.type === 'em_close') this.close('emphasized')
    else if (node.type === 'strong_open') this.open('strong')
    else if (node.type === 'strong_close') this.close('strong')
    else result = false
    return result
  }

  open (tagName: string) {
    this.tags.push(tagName)
  }

  close (tagName: string) {
    this.tags.splice(this.tags.indexOf('emphasized'), 1)
  }

  toString (): string {
    return this.tags.sort().join('')
  }
}
