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
    globals: []
    format: 'robust'
    useTempDirectory: false



  # Returns the value of the attribute with the given name
  get: (attribute-name) ->
    @constructor-args?[attribute-name] or @file-data?[attribute-name] or Configuration.default-values[attribute-name]


  # Creates a config file with default values
  create-default: ->
    fs.write-file-sync './tut-run.yml', YAML.stringify(Configuration.default-values)



module.exports = Configuration
