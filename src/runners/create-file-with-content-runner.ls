require! {
  'chalk' : {cyan}
  'prelude-ls' : {capitalize}
  'xmldoc' : {XmlDocument}
}


# Runs console command defined in a code block,
# where each line starts with "$ "
class CreateFileWithContentRunner

  (@filename, @lines) ->

    # whether we are currently within a bold section that contains the file path
    @reading-file-path = no

    # the path of the file to verify
    @file-path = ''

    # content of the file to verify
    @content = ''


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  run: ->
    console.log """
      #{@filename}:#{@lines[0]}-#{@lines[1]} -- creating file #{cyan @file-path} with content:
      #{cyan @content}

      """



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



module.exports = CreateFileWithContentRunner
