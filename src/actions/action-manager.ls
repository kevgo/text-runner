require! {
  'camelcase'
  'chalk' : {red}
  'glob'
  'interpret'
  'path'
  'prelude-ls' : {map}
  'rechoir'
}


# Loads and provides built-in and custom actions
class ActionManager

  (@formatter) ->
    @actions = {}
    @load-builtin-actions!
    @load-custom-actions!


  # Provides the action for the block with the given name
  action-for: (block-name) ->
    if !result = @actions[block-name.to-lower-case!]
      @formatter.error "unknown action: #{red block-name}"
      throw new Error 1
    result


  # Returns all possible filename extensions that actions can have
  javascript-extensions: ->
    interpret.js-variants
      |> Object.keys
      |> map (.slice 1)


  builtin-action-filenames: ->
    glob.sync path.join(__dirname, 'built-in', '*.js')


  custom-action-filenames: ->
    pattern = path.join(process.cwd!, 'text-run', "*.@(#{@javascript-extensions!.join '|'})")
    glob.sync pattern


  load-builtin-actions: ->
    for filename in @builtin-action-filenames!
      action-name = path.basename filename, path.extname(filename)
        |> camelcase
        |> (.replace /Action/, '')
        |> (.to-lower-case!)
      @actions[action-name] = require filename


  load-custom-actions: ->
    for filename in @custom-action-filenames!
      rechoir.prepare interpret.js-variants, filename
      action-name = path.basename filename, path.extname(filename)
        |> camelcase
        |> (.replace /Action/, '')
        |> (.to-lower-case!)
      @actions[action-name] = require filename



module.exports = ActionManager
