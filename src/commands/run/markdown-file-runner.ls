require! {
  './activity-list-builder' : ActivityListBuilder
  'async'
  'chalk' : {cyan}
  'fs'
  './link-target-builder' : LinkTargetBuilder
  './markdown-parser' : MarkdownParser
  'path'
  'prelude-ls' : {reject}
  'wait' : {wait}
}



# Runs the given Markdown file
class MarkdownFileRunner

  ({@file-path, @formatter, actions, @configuration, link-targets}) ->
    @parser = new MarkdownParser
    @activity-list-builder = new ActivityListBuilder {actions, @file-path, @formatter, @configuration, link-targets}
    @link-target-builder = new LinkTargetBuilder {link-targets}


  # Prepares this runner
  prepare: (done) ->
    # Need to start the file here
    # so that the formatter has the filename
    # in case there are errors preparing.
    fs.read-file @file-path, encoding: 'utf8', (err, markdown-text) ~>
      | err  =>  return done err
      try
        @formatter.start-file @file-path
        markdown-text .= trim!
        if markdown-text.length is 0
          @formatter.error "found empty file #{cyan(path.relative process.cwd!, @file-path)}"
          return done 1
        @run-data = @parser.parse markdown-text
          |> @link-target-builder.build-link-targets @file-path, _
          |> @activity-list-builder.build
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


module.exports = MarkdownFileRunner
