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
    @expected-content = ''


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  run: (done) ->
    try
      actual-content = fs.read-file-sync @file-path, 'utf8'
    catch
      if e.code is 'ENOENT'
        console.log red "#{@markdown-file-path}:#{@markdown-lines[0] + 1} -- file #{@file-path} not found"
        return done 1
    jsdiff-console actual-content, @expected-content, (err) ~>
      if err
        console.log red "#{@markdown-file-path}:#{@markdown-lines[0] + 1} -- mismatching content in #{@file-path}:"
        console.log err.message
        return done err
      console.log """
        #{@markdown-file-path}:#{@markdown-lines[0] + 1} -- verifying file #{cyan @file-path}
        """
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

