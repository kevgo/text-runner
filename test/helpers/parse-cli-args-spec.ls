require! {
  '../../src/helpers/parse-cli-args'
}


describe 'parse-cli-args' ->

  context 'with unix <node> call' (...) ->

    before ->
      @result = parse-cli-args [
        '/usr/local/Cellar/node/9.3.0_1/bin/node',
        '/Users/kevlar/d/text-runner/bin/text-run',
        'run'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'


  context 'with windows <node> call' (...) ->

    before ->
      @result = parse-cli-args [
        'C:\\Program Files (x86)\\nodejs\\node.exe',
        'C:\\projects\\text-runner\\bin\\text-run.cmd\\..\\..\\dist\\cli',
        'run'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns empty files' ->
      expect(@result.file).to.be.undefined

  context 'with <node> and <text-run> call' (...) ->

    before ->
      @result = parse-cli-args [
        '/usr/local/Cellar/node/9.3.0_1/bin/node',
        '/Users/kevlar/d/text-runner/bin/text-run',
        'run',
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'


  context 'with <text-run> call' (...) ->

    before ->
      @result = parse-cli-args [
        '/Users/kevlar/d/text-runner/bin/text-run',
        'run',
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'


  context '--fast <file>' (...) ->

    before ->
      @result = parse-cli-args [
        '--fast',
        'documentation/actions/cd.md'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns the "fast" switch', ->
      expect(@result.fast).to.be.true

    it 'returns the filename', ->
      expect(@result.file).to.equal 'documentation/actions/cd.md'


  context '<file>' (...) ->

    before ->
      @result = parse-cli-args [
        'documentation/actions/cd.md'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns the filename', ->
      expect(@result.file).to.equal 'documentation/actions/cd.md'


  context '(no args)' (...) ->

    before ->
      @result = parse-cli-args []

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns undefined as the filename', ->
      expect(@result.file).to.be.undefined


  context '--format robust' (...) ->

    before ->
      @result = parse-cli-args [
        '--format',
        'robust'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns the robust formatter option', ->
      expect(@result.format).to.equal 'robust'
