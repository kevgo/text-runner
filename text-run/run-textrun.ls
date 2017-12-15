require! {
  '../dist/helpers/call-args'
  'observable-process' : ObservableProcess
  'fs'
  'path'
}


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start 'running the created Markdown file'

  text-run-path = path.join __dirname, '..' 'bin' 'text-run'
  if process.platform is 'win32' then text-run-path += '.cmd'
  new ObservableProcess call-args(text-run-path), cwd: configuration.test-dir, stdout: {write: formatter.output}, stderr: {write: formatter.output}
    ..on 'ended', (exit-code) ~>
      | exit-code is 0  =>  formatter.success!
      | otherwise       =>  formatter.error "text-run exited with code #{exit-code} when processing the created Markdown file"
      done exit-code, 1
