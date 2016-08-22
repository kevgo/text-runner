require! {
  'chalk' : {strip-color}
  'child_process'
  'fs'
  'path'
}


module.exports  = ({formatter, searcher}, done) ->
  formatter.start 'running the created Markdown file'

  process = child_process.spawn '../bin/tut-run', cwd: 'tmp', encoding: 'utf8'
    ..stdout.on 'data', (data) -> formatter.output strip-color data.to-string!
    ..stderr.on 'data', (data) -> formatter.output strip-color data.to-string!
    ..on 'close', (exit-code) ~>
      | exit-code is 0  =>  formatter.success!
      | otherwise       =>  formatter.error "tut-run exited with code #{exit-code} when processing the created Markdown file"
      done exit-code, 1
