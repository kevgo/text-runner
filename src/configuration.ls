require! {
  'require-new'
  'require-yaml'
}


# Encapsulates logic around the configuration
class Configuration

  (@config-file-path) ->

    if @config-file-path
      @file-data = require-new @config-file-path


  @default-values =
    files: '**/*.md'


  # Returns the value of the attribute with the given name
  get: (attribute-name) ->
    @file-data?[attribute-name] ? Configuration.default-values[attribute-name]



module.exports = Configuration
