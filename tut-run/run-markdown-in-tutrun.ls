require! {
  'chalk' : {strip-color}
  'child_process'
  'dim-console'
  'fs'
  'path'
  'touch'
  '../src/tutorial-runner' : TutorialRunner
}


module.exports  = ({formatter, searcher}, done) ->
  formatter.start-activity 'verify that markdown works in tut-run'

  markdown = searcher.node-content type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no fenced block found'
    | !content  =>  'the block that defines markdown to run is empty'

  fs.write-file-sync path.join('tmp', '1.md'), markdown.replace /​/g, ''
  touch.sync path.join('tmp', 'tut-run.yml')

  process = child_process.spawn '../bin/tut-run', cwd: 'tmp', encoding: 'utf8'
    ..stdout.on 'data', (data) -> formatter.output strip-color data.to-string!
    ..stderr.on 'data', (data) -> formatter.output strip-color data.to-string!
    ..on 'close', (exit-code) ~>
      | exit-code is 0  =>  formatter.activity-success!
      | otherwise       =>  formatter.activity-error "tut-run exited with code #{exit-code} when processing this markdown block"
      done exit-code, 1
