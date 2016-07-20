require! {
  'async'
  'chalk' : {green, red}
  './markdown-file-runner' : MarkdownFileRunner
  'glob'
  'prelude-ls' : {flatten, sum}
}


# Runs the tutorial in the given directory
class TutorialRunner


  # Runs the given tutorial
  run: (dir) ->
    async.map-series @_runners(dir), ((runner, cb) -> runner.run cb), (err, results) ~>
      | err  =>  process.exit 1
      if (steps-count = results |> flatten |> sum) is 0
        console.log red 'Error: no activities found'
        process.exit 1
      console.log green "Success! #{steps-count} tests passed"


  # Returns all the markdown files for this tutorial
  _markdown-files: (dir) ->
    if (files = glob.sync "#{dir}/*.md").length is 0
      console.log red 'no Markdown files found'
      process.exit 1
    files



  # Returns an array of FileRunners for this tutorial
  _runners: (dir) ->
    [new MarkdownFileRunner(file) for file in @_markdown-files(dir)]



module.exports = TutorialRunner
