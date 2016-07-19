require! {
  'async'
  'events' : EventEmitter
  'fs'
  'path'
  'prelude-ls' : {capitalize}
  'remarkable' : Remarkable
  './runners/console-with-dollar-prompt-runner' : ConsoleWithDollarPromptRunner
  './runners/console-with-input-from-table-runner' : ConsoleWithInputFromTableRunner
  './runners/create-file-with-content-runner' : CreateFileWithContentRunner
  './runners/verify-file-content-runner' : VerifyFileContentRunner
}
debug = require('debug')('markdown-file-runner')


# Runs the given Markdown file
class MarkdownFileRunner extends EventEmitter

  (@path) ->
    @markdown-parser = new Remarkable 'full', html: yes

    # the current MFR runner instance
    @current-runner = null

    # the current line in the current markdown file
    @current-lines = 0

    # all runners
    @runners = []


  run: (done) ->
    debug "checking file #{@path}"
    markdown-text = fs.read-file-sync(@path, 'utf8').trim!
    if markdown-text.length is 0
      @emit 'error', "empty file: #{path.relative process.cwd!, @path}"
      @emit 'fail'
      return
    markdown-ast = @markdown-parser.parse markdown-text, {}
    @_check-nodes markdown-ast
    if @runners.length > 0
      @emit 'found-tests', @path, @runners.length
    async.each-series @runners,
                      ((runner, cb) -> runner.run cb),
                      done


  _check-nodes: (tree) ->
    for node in tree
      @current-lines = node.lines if node.lines
      if node.type is 'htmltag'

        if matches = node.content.match /<a class="tutorialRunner_([^"]+)">/
          throw new Error 'Found a nested <a class="tutorialRunner_*"> block' if @running
          class-name = "#{capitalize matches[1]}Runner"
          debug "instantiating '#{class-name}'"
          clazz = eval class-name
          @current-runner = new clazz path.relative(process.cwd!, @path), @current-lines

        if node.content is '</a>'
          @runners.push @current-runner if @current-runner
          @current-runner = null

      @current-runner?.load node
      @_check-nodes node.children if node.children


module.exports = MarkdownFileRunner
