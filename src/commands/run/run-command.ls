require! {
  'async'
  'glob'
  './markdown-file-runner' : MarkdownFileRunner
  'mkdirp'
  'path'
  'prelude-ls' : {flatten, sum}
  'rimraf'
}


class RunCommand

  ({@configuration, @formatter, @actions}) ->

  run: (done) ->
    @_create-working-dir!
    async.map-series @_runners!, ((runner, cb) -> runner.run cb), (err, results) ~>
      | err  =>  return done err
      if (steps-count = results |> flatten |> sum) is 0
        @formatter.error 'no activities found'
        done? 'no activities found'
      else
        @formatter.suite-success steps-count
        done?!


  # Creates the temp directory to run the tests in
  _create-working-dir: ->
    global.working-dir = path.join process.cwd!, 'tmp'
    rimraf.sync global.working-dir
    mkdirp.sync global.working-dir


  # Returns all the markdown files for this tutorial
  _markdown-files: ->
    if (files = glob.sync @configuration.get 'files').length is 0
      @formatter.error 'no Markdown files found'
    files


  # Returns an array of FileRunners for this tutorial
  _runners: ->
    [new MarkdownFileRunner({file-path, @formatter, @actions, @configuration}) for file-path in @_markdown-files!]



module.exports = RunCommand
