// @flow

const stripLeadingSlash = require('./strip-leading-slash.js')
const { expect } = require('chai')

describe('stripLeadingSlash', function () {
  it('strips the leading slash off strings', function () {
    expect(stripLeadingSlash('/foo')).to.equal('foo')
  })
  it('does not strip other slashes', function () {
    expect(stripLeadingSlash('/foo/bar')).to.equal('foo/bar')
  })
  it('works with strings that have no leading slash', function () {
    expect(stripLeadingSlash('foo/bar')).to.equal('foo/bar')
  })
})
