require! '../../src/helpers/available-commands'

describe 'available-commands' (...) ->

  before ->
    @result = available-commands!

  it 'returns the available commands' ->
    expect(@result).to.eql ['help', 'run', 'setup', 'version']
