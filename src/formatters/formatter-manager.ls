require! {
  'glob'
  'prelude-ls' : {map}
  'path'
}

class FormatterManager

  # Returns a list of all available formatter names
  available-formatter-names: ->
    path.join(__dirname, '*-formatter.js')
    |> glob.sync
    |> map (filename) -> path.basename filename, '.js'
    |> map (.replace /-formatter/, '')


  get-formatter: (name) ->
    | @.is-formatter-name name  =>  @.load-formatter name
    | _                         =>  [name, null]


  # Returns TRUE if the given object is the name of a formatter,
  # FALSE if it is a formatter.
  is-formatter-name: (obj) ->
    typeof obj is 'string'


  # Loads the formatter with the given name.
  # Returns the formatter and an optional error.
  load-formatter: (name) ->
    try
      FormatterClass = require("./#{name}-formatter")
      [new FormatterClass, null]
    catch
      return [null, "Unknown formatter: '#{name}'\n\nAvailable formatters are #{@available-formatter-names!.join ', '}"]



module.exports = FormatterManager
