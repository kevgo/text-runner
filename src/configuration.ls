require! {
  'fs'
  'require-new'
  'require-yaml'
  'yamljs' : YAML
}


# Encapsulates logic around the configuration
class Configuration

  (@config-file-path, @command-line-args) ->
    @file-data = if @config-file-path
      require-new @config-file-path
    else
      {}


  @default-values =
    files: '**/*.md'
    globals: []
    formatter: 'icons'


  # Returns the value of the attribute with the given name
  get: (attribute-name) ->
    @file-data?[attribute-name] or @command-line-args?[attribute-name] or Configuration.default-values[attribute-name]


  # Creates a config file with default values
  create-default: ->
    fs.write-file-sync './tut-run.yml', YAML.stringify(Configuration.default-values)



module.exports = Configuration
