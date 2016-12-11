require! {
  'async'
  'chalk' : {cyan}
  'dashify'
  'fs'
  'path'
  'prelude-ls' : {reject}
  'remarkable' : Remarkable
  './searcher' : Searcher
  'wait' : {wait}
}
debug = require('debug')('markdown-file-runner')


# Runs the given Markdown file
class MarkdownFileRunner

  ({@file-path, @formatter, @actions, @configuration, @link-targets}) ->
    @markdown-parser = new Remarkable 'full', html: on


  # Prepares this runner
  prepare: ->
    # Need to start the file here
    # so that the formatter has the filename
    # in case there are errors preparing.
    @formatter.start-file @file-path
    markdown-text = fs.read-file-sync(@file-path, 'utf8').trim!
    if markdown-text.length is 0
      @formatter.error "found empty file #{cyan(path.relative process.cwd!, @file-path)}"
    @run-data = @markdown-parser.parse markdown-text, {}
      |> @_standardize-ast
      |> @_build-link-targets
      |> @_iterate-nodes


  # Runs this runner
  # It must be prepared first
  run: (done) ->
    @formatter.start-file path.relative(process.cwd!, @file-path)
    async.map-series @run-data, @_run-block, (err) ~>
      done err, @run-data.length


  _run-block: (block, done) ->
    # waiting 1 ms here to give Node a chance to run queued up logic from previous steps
    wait 1, ->
      try
        block.formatter.set-lines block.start-line, block.end-line
        if block.runner.length is 1
          # synchronous action method
          block.runner block
          done!
        else
          # asynchronous action method
          block.runner block, done
      catch
        block.formatter.error e
        done e


  # standardizes the given AST into a flat array with this format:
  # [
  #   * line
  #     type
  #     content
  #   * line
  #     ...
  # ]
  _standardize-ast: (ast, line = 0, result = [], heading = null) ->
    modifiers = []
    for node in ast
      node-line = if node.lines?.length > 0 then node.lines[0] + 1 else line
      switch

        case node.type is 'strong_open'
          modifiers.push 'strong'

        case node.type is 'strong_close'
          modifiers.splice modifiers.index-of('strong'), 1

        case node.type is 'heading_open'
          heading =
            lines: node.lines
            text: ''

        case node.type is 'heading_close'
          result.push line: heading.lines[*-1], type: 'heading', content: heading.text, level: node.h-level
          heading = null

        case heading and node.type is 'text'
          heading.text += node.content

        case <[ fence htmlblock htmltag link_open text ]>.index-of(node.type) > -1
          result.push line: node-line, type: "#{modifiers.sort!.join!}#{node.type}", content: (node.content or node.href)

      if node.children
        @_standardize-ast node.children, node-line, result, heading

    result


  _build-link-targets: (tree) ->
    @link-targets[@file-path] or= []
    for node in tree

      if node.type is 'htmltag'
        if (matches = node.content.match /<a name="([^"]*)">/)
          @link-targets[@file-path].push type: 'anchor', name: matches[1]

      if node.type is 'heading'
        @link-targets[@file-path].push type: 'heading', name: dashify(node.content), text: node.content, level: node.level
    tree


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

        case @_is-link node
          result.push do
            filename: @file-path
            start-line: node.line
            end-line: node.line
            nodes: [node]
            runner: @actions.action-for 'checkLink'
            formatter: @formatter
            configuration: @configuration
            link-targets: @link-targets

    result


  # Returns whether the given node is a normal hyperlink
  _is-link: (node) ->
    node.type is 'link_open'


  # Indicates whether the given node is a start tag of an active block
  # by returning the type of the block, or falsy.
  _is-start-tag: (node) ->
    if node.type is 'htmltag' and matches = node.content.match /<a class="tutorialRunner_([^"]+)">/
      matches[1]


  # Returns whether the given node is the end of an active block
  _is-end-tag: (node) ->
    node.type is 'htmltag' and node.content is '</a>'


module.exports = MarkdownFileRunner
