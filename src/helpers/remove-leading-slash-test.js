// @flow

const removeLeadingSlash = require('./remove-leading-slash.js')
const { expect } = require('chai')

describe('removeLeadingSlash', function () {
  it('removes the leading slash if one exists', function () {
    expect(removeLeadingSlash('/foo/bar/')).to.equal('foo/bar/')
  })

  it('removes the leading backslash if one exists', function () {
    expect(removeLeadingSlash('\\foo\\bar\\')).to.equal('foo\\bar\\')
  })

  it('leaves a string without leading slash unchanged', function () {
    expect(removeLeadingSlash('foo/bar/')).to.equal('foo/bar/')
  })
})
