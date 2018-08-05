// @flow

const isRelativePath = require('./is-relative-path.js')
const { expect } = require('chai')

describe('isRelativePath', function () {
  it('returns false for paths beginning with /', function () {
    expect(isRelativePath('/content/foo')).to.be.false
  })
  it('returns false for paths beginning with \\', function () {
    expect(isRelativePath('\\content\\foo\\')).to.be.false
  })
  it('returns true for paths beginning with characters', function () {
    expect(isRelativePath('content/foo/')).to.be.true
  })
})
