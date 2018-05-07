// @flow

const customActionFilePaths = require('./custom-action-filepaths.js')
const { expect } = require('chai')

describe('customActionFilePaths', function () {
  it('returns the full paths to the custom actions', function () {
    const result = customActionFilePaths()
    expect(result[0]).to.match(/\/text-runner\/text-run\/cd-back.js/)
  })
})
