require! {
  'async'
  'glob'
  './markdown-file-runner' : MarkdownFileRunner
  'mkdirp'
  'path'
  'prelude-ls' : {head, filter, sum}
  'rimraf'
  'tmp'
}


class RunCommand

  ({@configuration, @formatter, @actions}) ->

  run: (@filename, done) ->
    try
      @_create-working-dir!
      @_execute-runners done
    catch
      console.log e


  # Creates the temp directory to run the tests in
  _create-working-dir: ->
    @configuration.test-dir = if @configuration.get('useTempDirectory')
      tmp.dir-sync!name
    else
      '.'


  # Returns all the markdown files for this tutorial
  _markdown-files: ->
    if (files = glob.sync @configuration.get 'files').length is 0
      @formatter.error 'no Markdown files found'
    if @filename
      files |> filter ~> it is @filename
    else
      files


  _execute-runners: (done) ->
    async.map-series @_runners!, ((runner, cb) -> runner.run cb), (err, results) ~>
      | err  =>  return done err
      if (steps-count = results |> sum) is 0
        @formatter.warning 'no activities found'
        done?!
      else
        @formatter.suite-success steps-count
        done?!


  # Returns an array of FileRunners for this tutorial
  _runners: ->
    [new MarkdownFileRunner({file-path, @formatter, @actions, @configuration}) for file-path in @_markdown-files!]



module.exports = RunCommand
