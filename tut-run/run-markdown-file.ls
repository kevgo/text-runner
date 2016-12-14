require! {
  '../dist/helpers/call-args'
  'chalk' : {strip-color}
  'observable-process' : ObservableProcess
  'fs'
  'path'
}


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start 'running the created Markdown file'

  tut-run-path = path.join __dirname, '..' 'bin' 'tut-run'
  if process.platform is 'win32' then tut-run-path += '.cmd'
  new ObservableProcess call-args(tut-run-path), cwd: configuration.test-dir, stdout: {write: formatter.output}, stderr: {write: formatter.output}
    ..on 'ended', (exit-code) ~>
      | exit-code is 0  =>  formatter.success!
      | otherwise       =>  formatter.error "tut-run exited with code #{exit-code} when processing the created Markdown file"
      done exit-code, 1
