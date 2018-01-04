// @flow

const Formatter = require('../../formatters/formatter.js')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')

type ErrorCheckerFunc = (value: {nodes: AstNodeList, content: string}) => ?string

class Searcher {
  filePath: string
  startLine: ?number
  endLine: ?number
  nodes: ?AstNodeList
  formatter: Formatter

  constructor (value: {filePath: string, startLine: ?number, endLine: ?number, nodes: ?AstNodeList, formatter: Formatter}) {
    this.filePath = value.filePath
    this.startLine = value.startLine
    this.endLine = value.endLine
    this.nodes = value.nodes
    this.formatter = value.formatter
  }

  nodeContent (query: {type: ?string, types: ?string[]}, errorChecker: ErrorCheckerFunc): string {
    if (this.nodes == null) return ''
    const nodes = this.nodes.filter((node) => {
      return (node.type === query.type) ||
             (query.types && query.types.includes(node.type))
    })
    var content = nodes[0] ? nodes[0].content : null
    if (content == null) content = ''
    const error = errorChecker ? errorChecker({nodes, content}) : null
    if (error != null) {
      throw new UnprintedUserError(error)
    }
    return content
  }
}

module.exports = Searcher
