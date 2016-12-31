require! {
  './searcher' : Searcher
}
debug = require('debug')('text-runner:markdown-parser')



# Returns a list of activities to do with the given AST
class ActivityListBuilder

  ({@actions, @configuration, @file-path, @formatter, @link-targets}) ->


  build: (tree) ->
    nodes-for-current-runner = null
    start-line = 0
    result = []
    for node in tree
      switch

        case block-type = @_is-start-tag node
          start-line = node.line
          if current-runner-type then
            @formatter.error 'Found a nested <a class="tr_*"> block'
            return null
          try
            if current-runner-type = @actions.action-for block-type
              nodes-for-current-runner = []
          catch
            if e.message isnt '1'
              console.log e
            throw e

        case @_is-end-tag node
          if current-runner-type
            result.push do
              filename: @file-path
              start-line: start-line
              end-line: node.line
              runner: current-runner-type
              nodes: nodes-for-current-runner
              formatter: @formatter
              configuration: @configuration
              searcher: new Searcher {@file-path, start-line, end-line: node.line, nodes: nodes-for-current-runner, @formatter}
          current-runner-type = null
          nodes-for-current-runner = null

        case current-runner-type
          nodes-for-current-runner.push node if nodes-for-current-runner

        case node.type is 'image'
          result.push do
            filename: @file-path
            start-line: node.line
            end-line: node.line
            nodes: [node]
            runner: @actions.action-for 'checkImage'
            formatter: @formatter
            configuration: @configuration

        case @_is-markdown-link node
          result.push do
            filename: @file-path
            start-line: node.line
            end-line: node.line
            nodes: [node]
            runner: @actions.action-for 'checkLink'
            formatter: @formatter
            configuration: @configuration
            link-targets: @link-targets

        case target = @_is-html-link node
          result.push do
            filename: @file-path
            start-line: node.line
            end-line: node.line
            nodes: [content: target]
            runner: @actions.action-for 'checkLink'
            formatter: @formatter
            configuration: @configuration
            link-targets: @link-targets

    result


  _is-html-link: (node) ->
    if node.type is 'htmltag' and matches = node.content.match /<a[^>]*href="([^"]*)".*?>/
      matches[1]


  # Returns whether the given node is a normal hyperlink
  _is-markdown-link: (node) ->
    node.type is 'link_open'


  # Indicates whether the given node is a start tag of an active block
  # by returning the type of the block, or falsy.
  _is-start-tag: (node) ->
    regex = new RegExp("""<a class="#{@configuration.get 'classPrefix'}([^"]+)">""")
    if node.type is 'htmltag' and matches = node.content.match regex
      matches[1]


  # Returns whether the given node is the end of an active block
  _is-end-tag: (node) ->
    node.type is 'htmltag' and node.content is '</a>'



module.exports = ActivityListBuilder
