require! {
  'chalk' : {bold, cyan, red}
  'fs'
  'prelude-ls' : {capitalize}
  'xmldoc' : {XmlDocument}
}


# Runs console command defined in a code block,
# where each line starts with "$ "
class CreateFileRunner

  (@markdown-line, @formatter) ->

    # whether we are currently within a bold section that contains the file path
    @reading-file-path = no

    # path of the file to create
    @file-path = ''

    # content of the file to create
    @content = ''

    # the line of the node that is currently being parsed
    @currently-loaded-node-line = 1


  load: (node) ->
    @currently-loaded-node-line = node.lines[0] + 1 if node.lines
    @["_load#{capitalize node.type}"]? node


  run: (done) ->
    if !@file-path then @formatter.parse-block-error 'no path given for file to create', @currently-loaded-node-line
    if !@content   then @formatter.parse-block-error 'no content given for file to create', @currently-loaded-node-line
    @formatter.start-activity "creating file #{cyan @file-path}", @markdown-line
    fs.write-file @file-path, @content, (err) ~>
      | err  =>  @formatter.activity-error!
      @formatter.activity-success!
      done null, 1



  _load-fence: (node) ~>
    | @content.length > 0  =>  @formatter.parse-block-error 'found second content block for file to create, please provide only one', node.lines[0] + 1
    @content = node.content.trim!


  _load-strong_open: (node) ~>
    @reading-file-path = yes


  _load-strong_close: (node) ~>
    @reading-file-path = no


  _load-text: (node) ~>
    | !@reading-file-path    =>  return
    | @file-path.length > 0  =>  @formatter.parse-block-error "several file paths found: #{cyan @file-path} and #{cyan node.content}", @currently-loaded-node-line
    @file-path = node.content.trim!
    if @file-path.length is ''  then @formatter.parse-block-error 'Empty file path found'



module.exports = CreateFileRunner
