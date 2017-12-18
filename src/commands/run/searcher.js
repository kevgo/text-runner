const Formatter = require('../../formatters/formatter.js')

class Searcher {
  constructor (value: {filePath: string, startLine: number, endLine: number, nodes: any, formatter: Formatter}) {
    this.filePath = value.filePath
    this.startLine = value.startLine
    this.endLine = value.endLine
    this.nodes = value.nodes
    this.formatter = value.formatter
  }

  nodeContent (query, errorChecker) {
    const nodes = this.nodes.filter((node) => {
      return (node.type === query.type) ||
             (query.types && query.types.includes(node.type))
    })
    const content = nodes[0] && nodes[0].content
    const error = errorChecker && errorChecker({nodes, content})
    if (error) {
      throw new Error(error)
    }
    return content
  }
}

module.exports = Searcher
