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
    var insideActiveBlock = false                    // whether we are currently processing nodes of an active block
    var nodesForCurrentRunner: AstNodeList = []
    var startLine = 0
    var result: ActivityList = []
    var currentRunnerType: Action = (value) => {}
    for (let node: AstNode of tree) {
      // active block start tag
      const blockType : ?string = this._isActiveBlockStartTag(node)
      if (blockType != null) {
        startLine = node.line
        if (insideActiveBlock) {
          this.formatter.error('Found a nested <a class="tr_*"> block')
          return []
        }
        currentRunnerType = this.actions.actionFor(blockType, this.filePath)
        if (currentRunnerType) {
          insideActiveBlock = true
          nodesForCurrentRunner = []
        }
        continue
      }

      if (this._isActiveBlockEndTag(node)) {
        if (insideActiveBlock) {
          result.push({
            filename: this.filePath,
            startLine: startLine,
            endLine: node.line,
            runner: currentRunnerType,
            nodes: nodesForCurrentRunner,
            formatter: this.formatter,
            linkTargets: this.linkTargets,
            configuration: this.configuration,
            searcher: new Searcher(nodesForCurrentRunner)
          })
        }
        insideActiveBlock = false
        nodesForCurrentRunner = []
        continue
      }

      if (insideActiveBlock) {
        nodesForCurrentRunner.push(node)
        continue
      }

      if (node.type === 'image') {
        // push 'check image' activity
        result.push({
          filename: this.filePath,
          startLine: node.line,
          endLine: node.line,
          nodes: [node],
          runner: this.actions.actionFor('checkImage', this.filePath),
          linkTargets: this.linkTargets,
          formatter: this.formatter,
          configuration: this.configuration,
          searcher: new Searcher([node])
        })
        continue
      }

      if (this._isMarkdownLink(node)) {
        // push 'check link' activity for Markdown links
        result.push({
          filename: this.filePath,
          startLine: node.line,
          endLine: node.line,
          nodes: [node],
          runner: this.actions.actionFor('checkLink', this.filePath),
          formatter: this.formatter,
          configuration: this.configuration,
          linkTargets: this.linkTargets,
          searcher: new Searcher([node])
        })
        continue
      }

      const target = this._htmlLinkTarget(node)
      if (target != null) {
        // push 'check link' activity for HTML links
        result.push({
          filename: this.filePath,
          startLine: node.line,
          endLine: node.line,
          nodes: [{content: target}],
          runner: this.actions.actionFor('checkLink', this.filePath),
          formatter: this.formatter,
          configuration: this.configuration,
          linkTargets: this.linkTargets,
          searcher: new Searcher([node])
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
  _isActiveBlockStartTag (node): ?string {
    if (node.type !== 'htmltag') return null
    const regex = new RegExp(`<a class="${this.configuration.get('classPrefix')}([^"]+)">`)
    if (node.content == null) return null
    const matches = node.content.match(regex)
    if (!matches) return null
    return matches[1]
  }

  // Returns whether the given node is the end of an active block
  _isActiveBlockEndTag (node) {
    return node.type === 'htmltag' && node.content === '</a>'
  }
}

module.exports = ActivityListBuilder
