require! {
  'async'
  'fs'
  'glob'
  './markdown-file-runner' : MarkdownFileRunner
  'mkdirp'
  'path'
  'prelude-ls' : {head, filter, reject, sort, sum}
  'rimraf'
  'tmp'
}
debug = require('debug')('text-runner:run-command')


class RunCommand

  ({@configuration, @formatter, @actions}) ->

    # lists which files contain which HTML anchors
    @link-targets = {}


  # Tests all files
  run-all: (done) ->
    @_run @_all-markdown-files!, done


  # Tests all files in the given directory
  run-directory: (dirname, done) ->
    @_run @_markdown-files-in-dir(dirname), done


  # Tests the given file
  run-file: (filename, done) ->
    @_run [filename], done


  run-glob: (file-expression, done) ->
    @_files-matching-glob file-expression, (err, files) ~>
      | err  =>  done err
      | _    =>  @_run files, done



  # Runs the currently set up runners.
  _run: (filenames, done) ->
    debug 'testing files:'
    for filename in filenames
      debug "  * #{filename}"
    try
      @_create-working-dir!
      @_create-runners filenames
      @_prepare-runners (err) ~>
        | err  =>  return done err
        @_execute-runners done
    catch
      console.log e
      throw e



  _create-runners: (filenames) ->
    @runners = for file-path in filenames
      new MarkdownFileRunner {file-path, @formatter, @actions, @configuration, @link-targets}


  # Creates the temp directory to run the tests in
  _create-working-dir: ->
    setting = @configuration.get 'useTempDirectory'
    @configuration.test-dir = switch
      | typeof setting is 'string'  =>  setting
      | setting is false            =>  path.join(process.cwd!, 'tmp')
      | setting is true             =>  tmp.dir-sync!name
      | otherwise                   =>  throw new Error "unknown 'useTempDirectory' setting: #{setting}"
    try
      debug "using test directory: #{@configuration.test-dir}"
      mkdirp.sync @configuration.test-dir
    catch
      null


  _files-matching-glob: (expression, done) ->
    glob expression, (err, files) ->
      | err  =>  done err
      | _    =>  done null, (files |> sort)


  # Returns all the markdown files in this directory and its children
  _markdown-files-in-dir: (dir-name) ->
    if (files = glob.sync "#{dir-name}/**/*.md").length is 0
      @formatter.warning 'no Markdown files found'
    files |> reject (.includes 'node_modules')
          |> sort


  # Returns all the markdown files in the current working directory
  _all-markdown-files: ->
    if (files = glob.sync @configuration.get 'files').length is 0
      @formatter.warning 'no Markdown files found'
    files = files |> reject (.includes 'node_modules')
                  |> sort
    if @filename
      files |> filter ~> it is @filename
    else
      files


  _execute-runner: (runner, done) ->
    try
      runner.run done
    catch
      console.log e
      done e


  _execute-runners: (done) ->
    async.map-series @runners, @_execute-runner, (err, results) ~>
      | err  =>  return done err
      if (steps-count = results |> sum) is 0
        @formatter.warning 'no activities found'
        done!
      else
        @formatter.suite-success steps-count
        done!


  _prepare-runner: (runner, done) ->
    runner.prepare done


  _prepare-runners: (done) ->
    async.each @runners, @_prepare-runner, done



module.exports = RunCommand
