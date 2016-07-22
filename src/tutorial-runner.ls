require! {
  'async'
  'chalk' : {green, red}
  './markdown-file-runner' : MarkdownFileRunner
  'glob'
  'mkdirp'
  'path'
  'prelude-ls' : {flatten, sum}
  './formatters/standard-formatter' : StandardFormatter
}


# Runs the tutorial in the given directory
class TutorialRunner

  ->
    @formatter = new StandardFormatter


  # Runs the given tutorial
  run: (dir) ->
    @_create-working-dir!
    async.map-series @_runners(dir), ((runner, cb) -> runner.run cb), (err, results) ~>
      | err  =>  process.exit 1
      if (steps-count = results |> flatten |> sum) is 0
        @formatter.error 'no activities found'
      @formatter.suite-success steps-count


  # Creates the temp directory to run the tests in
  _create-working-dir: ->
    global.working-dir = path.join process.cwd!, 'tmp', 'tut-run'
    mkdirp.sync global.working-dir


  # Returns all the markdown files for this tutorial
  _markdown-files: (dir) ->
    if (files = glob.sync "#{dir}/**/*.md").length is 0
      @formatter.error 'no Markdown files found'
    files



  # Returns an array of FileRunners for this tutorial
  _runners: (dir) ->
    [new MarkdownFileRunner(file, @formatter) for file in @_markdown-files(dir)]



module.exports = TutorialRunner
