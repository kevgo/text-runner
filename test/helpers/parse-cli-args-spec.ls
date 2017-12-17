require! {
  '../../src/helpers/parse-cli-args'
}


describe 'parse-cli-args' ->

  context '<node> <text-run> run --fast <file>' (...) ->

    before ->
      @result = parse-cli-args [
        '/usr/local/Cellar/node/9.3.0_1/bin/node',
        '/Users/kevlar/d/text-runner/bin/text-run',
        'run',
        '--fast',
        'documentation/actions/cd.md'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns the "fast" switch', ->
      expect(@result.options.fast).to.be.true

    it 'returns the filename', ->
      expect(@result.file).to.equal 'documentation/actions/cd.md'


  context '<node> <text-run> --fast run <file>' (...) ->

    before ->
      @result = parse-cli-args [
        '/usr/local/Cellar/node/9.3.0_1/bin/node',
        '/Users/kevlar/d/text-runner/bin/text-run',
        '--fast',
        'run',
        'documentation/actions/cd.md'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns the "fast" switch', ->
      expect(@result.options.fast).to.be.true

    it 'returns the filename', ->
      expect(@result.file).to.equal 'documentation/actions/cd.md'


  context '<node> <text-run> --fast <file>' (...) ->

    before ->
      @result = parse-cli-args [
        '/usr/local/Cellar/node/9.3.0_1/bin/node',
        '/Users/kevlar/d/text-runner/bin/text-run',
        '--fast',
        'documentation/actions/cd.md'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns the "fast" switch', ->
      expect(@result.options.fast).to.be.true

    it 'returns the filename', ->
      expect(@result.file).to.equal 'documentation/actions/cd.md'


  context '<node> <text-run> <file>' (...) ->

    before ->
      @result = parse-cli-args [
        '/usr/local/Cellar/node/9.3.0_1/bin/node',
        '/Users/kevlar/d/text-runner/bin/text-run',
        '--fast',
        'documentation/actions/cd.md'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns the filename', ->
      expect(@result.file).to.equal 'documentation/actions/cd.md'


  context '<node> <text-run>' (...) ->

    before ->
      @result = parse-cli-args [
        '/usr/local/Cellar/node/9.3.0_1/bin/node',
        '/Users/kevlar/d/text-runner/bin/text-run',
        '--fast'
      ]

    it 'returns the "run" command' ->
      expect(@result.command).to.equal 'run'

    it 'returns undefined as the filename', ->
      expect(@result.file).to.be.undefined
