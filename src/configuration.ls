require! {
  'fs'
  'require-uncached'
  'require-yaml'
  'yamljs' : YAML
}


# Encapsulates logic around the configuration
class Configuration

  # @constructor-args are either real constructor args when using the API,
  #                   or the command-line args when using the CLI
  (@config-file-path, @constructor-args) ->
    @file-data = if @config-file-path
      require-uncached @config-file-path
    else
      {}


  @default-values =
    files: '**/*.md'
    format: 'robust'
    useTempDirectory: false
    classPrefix: 'tr_'
    actions:
      run-console-command:
        globals: []



  # Returns the value of the attribute with the given name
  get: (attribute-name) ->
    @constructor-args?[attribute-name] or @file-data?[attribute-name] or Configuration.default-values[attribute-name]


  # Creates a config file with default values
  create-default: ->
    fs.write-file-sync './text-run.yml', """
      # white-list for files to test
      files: '**/*.md'

      # the formatter to use
      format: robust

      # prefix that makes anchor tags active regions
      classPrefix: 'tr_'

      # whether to run the tests in an external temp directory,
      # uses ./tmp if false,
      # you can also provide a custom directory path here
      useTempDirectory: false

      # action-specific configuration
      actions:
        runConsoleCommand:
          globals: []
      """



module.exports = Configuration
