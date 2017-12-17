require! '../../src/helpers/available-commands'

describe 'available-commands' (...) ->

  it 'returns the available commands' ->
    expect(available-commands!).to.eql ['help', 'run', 'setup', 'version']
