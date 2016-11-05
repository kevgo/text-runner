require! {
  'fs'
  'require-new'
  'require-yaml'
  'yamljs' : YAML
}


# Encapsulates logic around the configuration
class Configuration

  (@config-file-path) ->

    if @config-file-path
      @file-data = require-new @config-file-path


  @default-values =
    files: '**/*.md'
    globals: []


  # Returns the value of the attribute with the given name
  get: (attribute-name) ->
    @file-data?[attribute-name] ? Configuration.default-values[attribute-name]


  # Creates a config file with default values
  create-default: ->
    fs.write-file-sync './tut-run.yml', YAML.stringify(Configuration.default-values)



module.exports = Configuration
