// @flow

type NodeQuery = string | string[]

module.exports = class Searcher {
  // the AstNodes that belong to the active block that this Searcher is for
  nodes: AstNodeList

  // the currently executed query
  query: NodeQuery

  constructor (nodes: AstNodeList) {
    this.nodes = nodes
  }

  // Returns the textual content of the node matching the given query
  tagContent (query: NodeQuery, options: {default?: string}): string {
    const matchingNode = this.findNode(query, options)
    if (matchingNode == null) {
      if (options.default != null) {
        return options.default
      } else {
        throw new Error(`no ${this._queryName()} found`)
      }
    }
    var result = matchingNode.content || options.default || ''
    result = result.trim()
    if (result.length === 0 && options.default != null) {
      throw new Error(`empty ${this._queryName()} found`)
    }
    return result
  }

  // findNode returns the AstNode matching the given query
  findNode (query: NodeQuery, options: {default?: string}): ?AstNode {
    this.query = query
    const result = this.nodes.filter(this._getMatcher())
    if (result.length > 1) throw new Error(`found more than one ${this._queryName()}`)
    if (result.length === 0) {
      if (options.default != null) {
        return null
      } else {
        throw new Error(`no ${this._queryName()} found`)
      }
    }
    return result[0]
  }

  // _arrayMatcher is the matcher function for Array-type queries
  _arrayMatcher (node: AstNode): boolean {
    return node.type != null && this.query.includes(node.type)
  }

  // _getMatcher returns a function that returns
  // whether a given node matches the current query
  _getMatcher (): (AstNode) => boolean {
    if (typeof this.query === 'string') {
      return this._stringMatcher.bind(this)
    } else {
      return this._arrayMatcher.bind(this)
    }
  }

  // _stringMatcher is the matcher function for string-type queries
  _stringMatcher (node: AstNode): boolean {
    return node.type === this.query
  }

  // _queryName returns a textual representation of the current query
  _queryName (): string {
    if (typeof this.query === 'string') {
      return this.query
    } else {
      return this.query.join('|')
    }
  }
}
