const availableCommands = require('../../dist/commands/available-commands.js')

describe('available-commands', function () {
  it('returns the available commands', function () {
    expect(availableCommands()).to.eql(['help', 'run', 'setup', 'version'])
  })
})
