require! {
  '../src/configuration' : Configuration
  'fs'
  'path'
  'tmp'
}


describe 'Configuration', ->

  context 'no config file given', ->

    before ->
      @config = new Configuration

    describe 'files attribute', (...) ->

      it 'returns the default value', ->
        expect(@config.get 'files').to.equal '**/*.md'


  context 'config file given', ->

    before ->
      @config-dir = tmp.dir-sync!
      @config-file-path = path.join @config-dir.name, 'text-run.yml'
      fs.write-file-sync @config-file-path, "files: '*.md'"
      @config = new Configuration @config-file-path

    describe 'files attribute', (...) ->

      it 'returns the value from the file', ->
        expect(@config.get 'files').to.equal '*.md'
