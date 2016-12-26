require! {
  'chalk' : {cyan}
}


class SetupCommand

  ({@configuration, @formatter, @actions}) ->

  run: (_, done) ->
    @formatter.start "Create configuration file #{cyan 'text-run.yml'} with default values"
    @configuration.create-default!
    @formatter.success!
    done?!


module.exports = SetupCommand
