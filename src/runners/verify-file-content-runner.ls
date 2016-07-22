require! {
  'assert'
  'chalk' : {cyan, red}
  'fs'
  'jsdiff-console'
  'prelude-ls' : {capitalize}
}
debug = require('debug')('verify-file-content-runner')


# Verifies that a file whose name is provided in bold
# has the content provided as a code block
class VerifyFileContentRunner

  (@markdown-line, @formatter) ->

    # whether we are currently within a bold section that contains the file path
    @reading-file-path = no

    # the path of the file to verify
    @file-path = ''

    # content of the file to verify
    @expected-content = ''

    # the line of the node that is currently being parsed
    @currently-loaded-node-line = 1


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  run: (done) ->
    @formatter.start-activity "verifying file #{cyan @file-path}", @markdown-line
    try
      actual-content = fs.read-file-sync @file-path, 'utf8'
    catch
      if e.code is 'ENOENT'
        @formatter.activity-error "file #{@file-path} not found"
    jsdiff-console actual-content, @expected-content, (err) ~>
      if err
        @formatter.activity-error "mismatching content in #{@file-path}:\n#{err.message}"
      @formatter.activity-success!
      done null, 1



  _load-fence: (node) ~>
    | @expected-content.length > 0  =>  throw new Error 'Found second file content block, please provide only one'

    @expected-content = node.content.trim!


  _load-strong_open: (node) ~>
    @reading-file-path = yes


  _load-strong_close: (node) ~>
    @reading-file-path = no


  _load-text: (node) ~>
    | !@reading-file-path       =>  return
    | @file-path.length > 0     =>  throw new Error 'Found a file path, but already have one'

    @file-path = node.content.trim!
    if node.content.trim! is '' then throw new Error 'No file path found'



module.exports = VerifyFileContentRunner

