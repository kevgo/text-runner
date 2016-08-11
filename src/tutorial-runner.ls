require! {
  'async'
  './formatters/colored-formatter' : ColoredFormatter
  './markdown-file-runner' : MarkdownFileRunner
  'glob'
  'mkdirp'
  'path'
  'prelude-ls' : {flatten, sum}
}


# Runs the tutorial in the given directory
class TutorialRunner

  (@formatter = new ColoredFormatter) ->


  # Runs the given tutorial
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
    global.working-dir = path.join process.cwd!, 'tmp', 'tut-run'
    mkdirp.sync global.working-dir


  # Returns all the markdown files for this tutorial
  _markdown-files: ->
    if (files = glob.sync "**/*.md").length is 0
      @formatter.error 'no Markdown files found'
    files



  # Returns an array of FileRunners for this tutorial
  _runners: ->
    [new MarkdownFileRunner(file, @formatter) for file in @_markdown-files!]



module.exports = TutorialRunner
