// @flow

const removeDoubleSlash = require('./remove-double-slash.js')
const { expect } = require('chai')

describe('removeDoubleSlash', function () {
  it('removes double slashes', function () {
    expect(removeDoubleSlash('/foo//bar/')).to.equal('/foo/bar/')
  })
})
