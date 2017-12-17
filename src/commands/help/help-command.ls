require! {
  'chalk' : {bold, dim, red}
  '../../../package.json' : pkg
}


class HelpCommand

  ({@err}) ->

  run: (_, done) ->
    error = if @err
      "\n#{red bold "Error: #{@err}"}\n\n"
    else
      ''

    console.log """
      #{dim "TextRunner #{pkg.version}"}
      #{error}
      USAGE: #{bold 'text-run [<options>] <command>'}

      COMMANDS:
        #{bold 'run'} [<filename>]  tests the entire documentation, or only the given file
        #{bold 'setup'}             creates an example configuration file
        #{bold 'help'}              shows this help screen
        #{bold 'version'}           shows the currently installed version of the tool

      OPTIONS:
        #{bold '--fast'}            don't check external links
      """
    done?!



module.exports = HelpCommand
