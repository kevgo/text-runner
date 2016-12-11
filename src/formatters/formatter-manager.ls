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


  get-formatter: (name, done) ->
    | @.is-formatter-name name  =>  @.load-formatter name, done
    | otherwise                 =>  done null, name


  # Returns TRUE if the given object is the name of a formatter,
  # FALSE if it is a formatter.
  is-formatter-name: (obj) ->
    typeof obj is 'string'


  # Loads the formatter with the given name.
  # Returns the formatter and an optional error.
  load-formatter: (name, done) ->
    try
      FormatterClass = require("./#{name}-formatter")
      done null, new FormatterClass
    catch
      switch
      | e.code is 'MODULE_NOT_FOUND'  =>  done "Unknown formatter: '#{name}'\n\nAvailable formatters are #{@available-formatter-names!.join ', '}"
      | otherwise                     =>  console.log e ; done e



module.exports = FormatterManager
