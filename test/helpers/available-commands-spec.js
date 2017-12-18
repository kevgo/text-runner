const availableCommands = require('../../src/helpers/available-commands')

describe('available-commands', function () {
  it('returns the available commands', function () {
    expect(availableCommands()).to.eql(['help', 'run', 'setup', 'version'])
  })
})
