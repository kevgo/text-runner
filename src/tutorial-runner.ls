require! {
  'async'
  'events' : EventEmitter
  './markdown-file-runner' : MarkdownFileRunner
  'glob'
}


# Runs the tutorial in the given directory
class TutorialRunner extends EventEmitter

  # Runs the given tutorial
  run: (dir) ->
    runners = @_runners(dir)
    if runners.length is 0
      @emit 'error', 'no files found'
      @emit 'fail'
      return
    async.each-series runners,
                      ((runner, cb) -> runner.run cb),
                      (err) ~> @emit 'pass'


  # Returns all the markdown files for this tutorial
  _markdown-files: (dir) ->
    glob.sync "#{dir}/*.md"


  # Returns an array of FileRunners for this tutorial
  _runners: (dir) ->
    @_markdown-files(dir).map (file) ~>
      runner = new MarkdownFileRunner file
        ..on 'error', (err) ~> @emit 'error', err
        ..on 'fail', ~> @emit 'fail'
      runner





module.exports = TutorialRunner
