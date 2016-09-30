require! {
  'chalk' : {cyan}
}


class SetupCommand

  ({@configuration, @formatter, @actions}) ->

  run: (done) ->
    @formatter.start "Create configuration file #{cyan 'tut-run.yml'} with default values"
    @configuration.create-default!
    @formatter.success!
    done?!


module.exports = SetupCommand
