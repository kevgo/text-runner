require! {
  'async'
  'chalk' : {cyan, red}
  'fs'
  'path'
  'prelude-ls' : {capitalize}
  'remarkable' : Remarkable
  './runners/console-command-runner' : ConsoleCommandRunner
  './runners/console-with-input-from-table-runner' : ConsoleWithInputFromTableRunner
  './runners/create-file-with-content-runner' : CreateFileWithContentRunner
  './runners/verify-file-content-runner' : VerifyFileContentRunner
}
debug = require('debug')('markdown-file-runner')


# Runs the given Markdown file
class MarkdownFileRunner

  (@file-path) ->
    @markdown-parser = new Remarkable 'full', html: on

    # the current block runner instance
    @current-runner = null

    # the current line in the current markdown file
    @current-line = 0

    # all runners
    @runners = []


  run: (done) ->
    debug "checking file #{@file-path}"
    markdown-text = fs.read-file-sync(@file-path, 'utf8').trim!
    if markdown-text.length is 0
      console.log red "Error: found empty file #{cyan(path.relative process.cwd!, @file-path)}"
      process.exit 1
    markdown-ast = @markdown-parser.parse markdown-text, {}
    @_check-nodes markdown-ast
    async.map-series @runners,
                      ((runner, cb) -> runner.run cb),
                      done


  _check-nodes: (tree) ->
    for node in tree
      @current-line = node.lines[0] + 1 if node.lines
      if node.type is 'htmltag'

        if matches = node.content.match /<a class="tutorialRunner_([^"]+)">/
          throw new Error 'Found a nested <a class="tutorialRunner_*"> block' if @running
          class-name = "#{capitalize matches[1]}Runner"
          debug "instantiating '#{class-name}'"
          clazz = eval class-name
          @current-runner = new clazz path.relative(process.cwd!, @file-path), @current-line

        if node.content is '</a>'
          @runners.push @current-runner if @current-runner
          @current-runner = null

      @current-runner?.load node
      @_check-nodes node.children if node.children


module.exports = MarkdownFileRunner
