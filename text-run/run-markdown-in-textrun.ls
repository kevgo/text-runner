require! {
  '../dist/helpers/call-args'
  'chalk' : {strip-color}
  'dim-console'
  '../dist/helpers/call-args'
  'fs'
  'observable-process' : ObservableProcess
  'path'
  '../src/text-runner' : TextRunner
}


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start 'verify that markdown works in text-run'

  markdown = searcher.node-content type: 'fence', ({content, nodes}) ->
    | nodes.length > 1   =>  "Found #{nodes.length} fenced code blocks. Only one is allowed."
    | nodes.length is 0  =>  'You must provide the Markdown to run via text-run as a fenced code block. No such fenced block found.'
    | !content  =>  'A fenced code block containing the Markdown to run was found, but it is empty, so I cannot run anything here.'

  fs.write-file-sync path.join(configuration.test-dir, '1.md'), markdown.replace /​/g, ''

  # we need to configure the TextRunner instance called by our own Markdown to run its tests in its current directory,
  # because in README.md we call it to run Markdown that verifies Markdown we ran manually.
  # So TextRunner that verifies Markdown in README.md must run in the same directory as the other Markdown in README.md.
  fs.write-file-sync path.join(configuration.test-dir, 'text-run.yml'), "useTempDirectory: '.'"

  text-run-path = path.join __dirname, '..' 'bin' 'text-run'
  if process.platform is 'win32' then text-run-path += '.cmd'
  new ObservableProcess call-args(text-run-path), cwd: configuration.test-dir, stdout: {write: formatter.output}, stderr: {write: formatter.output}
    ..on 'ended', (exit-code) ~>
      | exit-code is 0  =>  formatter.success!
      | otherwise       =>  formatter.error "text-run exited with code #{exit-code} when processing this markdown block"
      done exit-code, 1
