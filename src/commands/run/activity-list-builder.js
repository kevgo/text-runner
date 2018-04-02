// @flow

import type { HandlerFunction } from './handler-function.js'
import type { ActivityList } from '../../commands/run/activity-list.js'
import type { AstNode } from '../../parsers/ast-node.js'
import type { AstNodeList } from '../../parsers/ast-node-list.js'
import type { LinkTargetList } from '../../commands/run/link-target-list.js'

const ActivityTypeManager = require('./activity-type-manager.js')
const Configuration = require('../../configuration/configuration.js')
const Formatter = require('../../formatters/formatter.js')
const Searcher = require('./searcher')
const toSpaceCase = require('to-space-case')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')

class ActivityListBuilder {
  // Returns a list of activities to do with the given AST

  activityTypesManager: ActivityTypeManager
  configuration: Configuration
  filePath: string
  formatter: Formatter
  linkTargets: LinkTargetList
  regex: RegExp

  constructor (value: {
    activityTypesManager: ActivityTypeManager,
    configuration: Configuration,
    filePath: string,
    formatter: Formatter,
    linkTargets: LinkTargetList
  }) {
    this.activityTypesManager = value.activityTypesManager
    this.configuration = value.configuration
    this.filePath = value.filePath
    this.formatter = value.formatter
    this.linkTargets = value.linkTargets
    this.regex = new RegExp(
      ` ${this.configuration.get('classPrefix')}="([^"]+)"`
    )
  }

  build (tree: AstNodeList): ActivityList {
    var insideActiveBlock = false // whether we are currently processing nodes of an active block
    var nodesForCurrentRunner: AstNodeList = []

    // contains the most recent line in the file that we are aware of
    var line = 1
    var blockType = ''
    var result: ActivityList = []
    var currentRunnerType: HandlerFunction = value => {}
    for (let node: AstNode of tree) {
      const isActiveBlockStartTag = this._determineIsActiveBlockStartTag(node)
      if (isActiveBlockStartTag) {
        if (insideActiveBlock) {
          throw new UnprintedUserError(
            `Block ${node.content || ''} is nested in another 'textrun' block.`,
            this.filePath,
            line
          )
        }
        insideActiveBlock = true
        if (node.line != null) {
          line = node.line
        }
        blockType = this._getBlockType(node)
        currentRunnerType = this.activityTypesManager.handlerFunctionFor(
          blockType,
          this.filePath
        )
        nodesForCurrentRunner = []
        continue
      }

      if (this._isActiveBlockEndTag(node)) {
        if (insideActiveBlock) {
          result.push({
            filename: this.filePath,
            activityTypeName: this._convertIntoActivityTypeName(blockType),
            line: node.line,
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
          activityTypeName: this._convertIntoActivityTypeName(blockType),
          line: node.line,
          nodes: [node],
          runner: this.activityTypesManager.handlerFunctionFor(
            'checkImage',
            this.filePath,
            node.line
          ),
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
          activityTypeName: this._convertIntoActivityTypeName(blockType),
          line: node.line,
          nodes: [node],
          runner: this.activityTypesManager.handlerFunctionFor(
            'checkLink',
            this.filePath
          ),
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
          activityTypeName: this._convertIntoActivityTypeName(blockType),
          line: node.line,
          nodes: [{ content: target }],
          runner: this.activityTypesManager.handlerFunctionFor(
            'checkLink',
            this.filePath
          ),
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

  _convertIntoActivityTypeName (blockType): string {
    return toSpaceCase(blockType || '')
  }

  // Returns whether the given node is a normal hyperlink
  _isMarkdownLink (node) {
    return node.type === 'link_open'
  }

  // _determineIsActiveBlockStartTag returns whether the given AstNode is the start of an active block
  _determineIsActiveBlockStartTag (node: AstNode): boolean {
    if (node.type !== 'htmltag') return false
    if (!node.content) return false
    return this.regex.test(node.content)
  }

  // _getBlockType returns the activity type started by the given AstNode that starts an active block
  _getBlockType (node: AstNode): string {
    if (node.content == null) throw new Error("this shouldn't happen")
    const matches = node.content.match(this.regex)
    if (!matches) throw new Error("this shouldn't happen")
    return matches[1]
  }

  // Returns whether the given node is the end of an active block
  _isActiveBlockEndTag (node) {
    return node.type === 'htmltag' && node.content === '</a>'
  }
}

module.exports = ActivityListBuilder
