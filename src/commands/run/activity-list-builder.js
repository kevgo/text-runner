// @flow

const ActionManager = require('../../actions/action-manager.js')
const Configuration = require('../../configuration.js')
const Formatter = require('../../formatters/formatter.js')
const Searcher = require('./searcher')

class ActivityListBuilder {
  // Returns a list of activities to do with the given AST

  actions: ActionManager
  configuration: Configuration
  filePath: string
  formatter: Formatter
  linkTargets: LinkTargetList

  constructor (value: {actions: ActionManager, configuration: Configuration, filePath: string, formatter: Formatter, linkTargets: LinkTargetList}) {
    this.actions = value.actions
    this.configuration = value.configuration
    this.filePath = value.filePath
    this.formatter = value.formatter
    this.linkTargets = value.linkTargets
  }

  build (tree: AstNodeList): ActivityList {
    var nodesForCurrentRunner: ?AstNodeList
    var startLine = 0
    var result: ActivityList = []
    var currentRunnerType: ?Action
    for (let node: AstNode of tree) {
      // link start tag
      const blockType : ?string = this._isStartTag(node)
      if (blockType != null) {
        startLine = node.line
        if (currentRunnerType) {
          this.formatter.error('Found a nested <a class="tr_*"> block')
          return []
        }
        currentRunnerType = this.actions.actionFor(blockType, this.filePath)
        if (currentRunnerType) {
          nodesForCurrentRunner = []
        }
        continue
      }

      if (this._isEndTag(node)) {
        if (currentRunnerType) {
          result.push({
            filename: this.filePath,
            startLine: startLine,
            endLine: node.line,
            runner: currentRunnerType,
            nodes: nodesForCurrentRunner,
            formatter: this.formatter,
            configuration: this.configuration,
            searcher: new Searcher({
              filePath: this.filePath,
              startLine: startLine,
              endLine: node.line,
              nodes: nodesForCurrentRunner,
              formatter: this.formatter
            })
          })
        }
        currentRunnerType = null
        nodesForCurrentRunner = null
        continue
      }

      if (currentRunnerType) {
        if (nodesForCurrentRunner) {
          nodesForCurrentRunner.push(node)
        }
        continue
      }

      if (node.type === 'image') {
        result.push({
          filename: this.filePath,
          startLine: node.line,
          endLine: node.line,
          nodes: [node],
          runner: this.actions.actionFor('checkImage', this.filePath),
          formatter: this.formatter,
          configuration: this.configuration
        })
        continue
      }

      if (this._isMarkdownLink(node)) {
        result.push({
          filename: this.filePath,
          startLine: node.line,
          endLine: node.line,
          nodes: [node],
          runner: this.actions.actionFor('checkLink', this.filePath),
          formatter: this.formatter,
          configuration: this.configuration,
          linkTargets: this.linkTargets
        })
        continue
      }

      const target = this._htmlLinkTarget(node)
      if (target != null) {
        result.push({
          filename: this.filePath,
          startLine: node.line,
          endLine: node.line,
          nodes: [{content: target}],
          runner: this.actions.actionFor('checkLink', this.filePath),
          formatter: this.formatter,
          configuration: this.configuration,
          linkTargets: this.linkTargets
        })
        continue
      }
    }

    return result
  }

  _htmlLinkTarget (node: AstNode): ?string {
    if (node.content == null) return null
    const matches = node.content.match(/<a[^>]*href="([^"]*)".*?>/)
    if (node.type === 'htmltag' && matches) {
      return matches[1]
    }
  }

  // Returns whether the given node is a normal hyperlink
  _isMarkdownLink (node) {
    return node.type === 'link_open'
  }

  // Indicates whether the given node is a start tag of an active block
  // by returning the type of the block, or falsy.
  _isStartTag (node): ?string {
    if (node.type !== 'htmltag') return null
    const regex = new RegExp(`<a class="${this.configuration.get('classPrefix')}([^"]+)">`)
    if (node.content == null) return null
    const matches = node.content.match(regex)
    if (!matches) return null
    return matches[1]
  }

  // Returns whether the given node is the end of an active block
  _isEndTag (node) {
    return node.type === 'htmltag' && node.content === '</a>'
  }
}

module.exports = ActivityListBuilder
