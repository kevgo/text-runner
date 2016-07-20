require! {
  'chalk' : {cyan, red}
  'fs'
  'prelude-ls' : {capitalize}
  'xmldoc' : {XmlDocument}
}


# Runs console command defined in a code block,
# where each line starts with "$ "
class CreateFileWithContentRunner

  (@markdown-file-path, @markdown-line) ->

    # whether we are currently within a bold section that contains the file path
    @reading-file-path = no

    # path of the file to create
    @file-path = ''

    # content of the file to create
    @content = ''


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  run: (done) ->
    unless @file-path
      console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: no path given for file to create"
      process.exit 1
    unless @content
      console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: no content given for file to create"
      process.exit 1
    console.log """
      #{@markdown-file-path}:#{@markdown-line} -- creating file #{cyan @file-path} with content:
      #{cyan @content}

      """
    fs.write-file @file-path, @content, (err) ->
      done err, 1



  _load-fence: (node) ~>
    | @content.length > 0  =>
        console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: found second content block for file to create, please provide only one"
        process.exit 1

    @content = node.content.trim!


  _load-strong_open: (node) ~>
    @reading-file-path = yes


  _load-strong_close: (node) ~>
    @reading-file-path = no


  _load-text: (node) ~>
    | !@reading-file-path       =>  return
    | @file-path.length > 0     =>
        console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: several file paths found: #{cyan @file-path} and #{cyan node.content}"
        process.exit 1

    @file-path = node.content.trim!
    if @file-path.length is ''  then throw new Error 'Empty file path found'



module.exports = CreateFileWithContentRunner
