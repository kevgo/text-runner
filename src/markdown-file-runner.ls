require! {
  'async'
  'chalk' : {cyan}
  'fs'
  'path'
  'remarkable' : Remarkable
  './searcher' : Searcher
}
debug = require('debug')('markdown-file-runner')


# Runs the given Markdown file
class MarkdownFileRunner

  ({@file-path, @formatter, @actions}) ->
    @markdown-parser = new Remarkable 'full', html: on


  run: (done) ->
    @formatter.start-file path.relative(process.cwd!, @file-path)
    markdown-text = fs.read-file-sync(@file-path, 'utf8').trim!
    if markdown-text.length is 0
      @formatter.error "found empty file #{cyan(path.relative process.cwd!, @file-path)}"
    run-data = @markdown-parser.parse markdown-text, {}
      |> @_standardize-ast
      |> @_iterate-nodes
    async.map-series run-data, @_run-block, done


  _run-block: (block, done) ->
    try
      if block.runner.length is 1
        block.runner block
        done null, 1
      else
        block.runner block, -> done null, 1
    catch
      block.formatter.error e.message or e
      done 1


  # standardizes the given AST into a flat array with this format:
  # [
  #   * line
  #     type
  #     content
  #   * line
  #     ...
  # ]
  _standardize-ast: (ast, line = 0, result = []) ->
    for node in ast
      node-line = if node.lines?.length > 0 then node.lines[0] + 1 else line
      if <[ htmltag fence text strong_open strong_close ]>.includes node.type
        result.push line: node-line, type: node.type, content: node.content
      if node.children
        @_standardize-ast node.children, node-line, result
    result


  _iterate-nodes: (tree) ->
    nodes-for-current-runner = null
    start-line = 0
    result = []
    for node in tree
      switch

        case block-type = @_is-start-tag node
          start-line = node.line
          if current-runner-type then
            @formatter.error 'Found a nested <a class="tutorialRunner_*"> block'
            return null
          if current-runner-type = @actions.action-for block-type
            nodes-for-current-runner = []

        case @_is-end-tag node
          if current-runner-type
            @formatter.set-lines start-line, node.line
            result.push do
              filename: @file-path
              start-line: start-line
              end-line: node.line
              runner: current-runner-type
              nodes: nodes-for-current-runner
              formatter: @formatter
              searcher: new Searcher {@file-path, start-line, end-line: node.line, nodes: nodes-for-current-runner, @formatter}
          nodes-for-current-runner = null

        case current-runner-type
          nodes-for-current-runner.push node if nodes-for-current-runner

    result


  # Indicates whether the given node is a start tag of an active block
  # by returning the type of the block, or falsy.
  _is-start-tag: (node) ->
    if node.type is 'htmltag' and matches = node.content.match /<a class="tutorialRunner_([^"]+)">/
      matches[1]


  # Returns whether the given node is the end of an active block
  _is-end-tag: (node) ->
    node.type is 'htmltag' and node.content is '</a>'


module.exports = MarkdownFileRunner
