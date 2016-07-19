require! {
  'async'
  'events' : EventEmitter
  './markdown-file-runner' : MarkdownFileRunner
  'glob'
}


# Runs the tutorial in the given directory
class TutorialRunner extends EventEmitter

  ->
    @steps-count = 0


  # Runs the given tutorial
  run: (dir) ->
    runners = @_runners(dir)
    if runners.length is 0
      @emit 'error', 'no files found'
      @emit 'fail'
      return
    async.each-series runners,
                      ((runner, cb) -> runner.run cb),
                      (err) ~>
                        if @steps-count is 0
                          console.log 'no activities found'
                          @emit 'fail'
                        else
                          @emit 'pass'


  # Returns all the markdown files for this tutorial
  _markdown-files: (dir) ->
    glob.sync "#{dir}/*.md"


  # Returns an array of FileRunners for this tutorial
  _runners: (dir) ->
    @_markdown-files(dir).map (file) ~>
      runner = new MarkdownFileRunner file
        ..on 'error', (err) ~> @emit 'error', err
        ..on 'fail', ~> @emit 'fail'
        ..on 'found-tests', (file, count) ~> @steps-count += 1
      runner





module.exports = TutorialRunner
