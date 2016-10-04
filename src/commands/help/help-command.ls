require! {
  'chalk' : {bold, dim, red}
  '../../../package.json' : pkg
}


class HelpCommand

  ({@err}) ->

  run: (done) ->
    error = if @err
      "\n#{red bold "Error: #{@err}"}\n\n"
    else
      ''

    console.log """
      #{dim "Tutorial Runner #{pkg.version}"}
      #{error}
      USAGE: #{bold 'tut-run <command>'}

      COMMANDS:
      - #{bold 'run'}     runs the tutorial
      - #{bold 'setup'}   creates an example configuration file
      - #{bold 'help'}    shows this help screen

      """
    done?!



module.exports = HelpCommand
