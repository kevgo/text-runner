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

  (@markdown-file-path, @markdown-lines) ->

    # whether we are currently within a bold section that contains the file path
    @reading-file-path = no

    # the path of the file to verify
    @file-path = ''

    # content of the file to verify
    @content = ''


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  run: (done) ->
    console.log """
      #{@markdown-file-path}:#{@markdown-lines[0] + 1} -- verifying file #{cyan @file-path}
      """
    try
      content = fs.read-file-sync @file-path, 'utf8'
    catch
      if e.code is 'ENOENT'
        console.log red "Error: expected file #{@file-path} to exist, but not found"
        return done 1
    jsdiff-console content, @content, done



  _load-fence: (node) ~>
    | @content.length > 0  =>  throw new Error 'Found second file content block, please provide only one'

    @content = node.content.trim!


  _load-strong_open: (node) ~>
    @reading-file-path = yes


  _load-strong_close: (node) ~>
    @reading-file-path = no


  _load-text: (node) ~>
    | !@reading-file-path       =>  return
    | @file-path.length > 0     =>  throw new Error 'Found a file path, but already have one'
    | node.content.trim! is ''  =>  throw new Error 'No file path found'

    @file-path = node.content.trim!



module.exports = VerifyFileContentRunner

