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
    runners = @_runners(dir)
    if runners.length is 0
      console.log red 'no Markdown files found'
      process.exit 1
    async.map-series runners,
                      ((runner, cb) -> runner.run cb),
                      (err, results) ~>
                        | err  =>  process.exit 1
                        steps-count = results |> flatten |> sum
                        unless steps-count
                          console.log red 'no activities found'
                          process.exit 1
                        console.log green "#{steps-count} tests passed"


  # Returns all the markdown files for this tutorial
  _markdown-files: (dir) ->
    glob.sync "#{dir}/*.md"


  # Returns an array of FileRunners for this tutorial
  _runners: (dir) ->
    [new MarkdownFileRunner(file) for file in @_markdown-files(dir)]





module.exports = TutorialRunner
