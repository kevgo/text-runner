require! {
  'async'
  'chalk' : {cyan}
  'dashify'
  'fs'
  './markdown-parser' : MarkdownParser
  'path'
  'prelude-ls' : {reject}
  './searcher' : Searcher
  'wait' : {wait}
}
debug = require('debug')('markdown-file-runner')


# Runs the given Markdown file
class MarkdownFileRunner

  ({@file-path, @formatter, @actions, @configuration, @link-targets}) ->
    @parser = new MarkdownParser


  # Prepares this runner
  prepare: (done) ->
    # Need to start the file here
    # so that the formatter has the filename
    # in case there are errors preparing.
    @formatter.start-file @file-path
    fs.read-file @file-path, encoding: 'utf8', (err, markdown-text) ~>
      | err  =>  return done err
      try
        markdown-text .= trim!
        if markdown-text.length is 0
          @formatter.error "found empty file #{cyan(path.relative process.cwd!, @file-path)}"
          return done 1
        @run-data = @parser.parse markdown-text
          |> @_build-link-targets
          |> @_iterate-nodes
        done!
      catch
        console.log e if e.message isnt '1'
        done e


  # Runs this runner
  # (after it has been prepared)
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


  _build-link-targets: (tree) ->
    @link-targets[@file-path] or= []
    for node in tree
      switch node.type

        case 'htmltag'
          if (matches = node.content.match /<a name="([^"]*)">/)
            @link-targets[@file-path].push type: 'anchor', name: matches[1]

        case 'heading'
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
    if node.type is 'htmltag' and matches = node.content.match /<a class="tutorialRunner_([^"]+)">/
      matches[1]


  # Returns whether the given node is the end of an active block
  _is-end-tag: (node) ->
    node.type is 'htmltag' and node.content is '</a>'


module.exports = MarkdownFileRunner
