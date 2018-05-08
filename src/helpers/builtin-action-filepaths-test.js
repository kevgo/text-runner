// @flow

const builtinActionFilenames = require('./builtin-action-filepaths.js')
const { expect } = require('chai')

describe('builtinActionFilenames', function () {
  it('returns the built-in action file paths', function () {
    const result = builtinActionFilenames()
    expect(result[0]).to.match(/\/text-runner\/src\/actions\/cd.js/)
  })
})
