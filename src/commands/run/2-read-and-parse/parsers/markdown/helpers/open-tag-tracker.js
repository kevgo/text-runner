// @flow

type TagData = {
  node: Object,
  line: number,
  text: string // textual content of the tag
}

const UnprintedUserError = require('../../../../../../errors/unprinted-user-error.js')

module.exports = class OpenTagTracker {
  openTags: { [string]: TagData }

  constructor () {
    this.openTags = {}
  }

  add (node: Object, filepath: string, line: number) {
    if (this.hasNode(node)) {
      throw new UnprintedUserError(`nested tag: ${node.type}`, filepath, line)
    }
    this.openTags[node.type] = {
      node,
      line,
      text: ''
    }
  }

  addText (text: string) {
    for (let type in this.openTags) {
      this.openTags[type].text += text
    }
  }

  hasNode (node: Object): boolean {
    return !!this.openTags[node.type]
  }

  popOpenTagFor (nodeType: string): TagData {
    const result = this.openTags[nodeType]
    if (!result) {
      throw new UnprintedUserError(`cannot find open tag ${nodeType}`)
    }
    delete this.openTags[nodeType]
    return result
  }
}
