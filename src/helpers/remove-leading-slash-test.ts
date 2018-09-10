import removeLeadingSlash from './remove-leading-slash.js'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('removeLeadingSlash', function() {
  it('removes the leading slash if one exists', function() {
    expect(removeLeadingSlash('/foo/bar/')).to.equal('foo/bar/')
  })

  it('removes the leading backslash if one exists', function() {
    expect(removeLeadingSlash('\\foo\\bar\\')).to.equal('foo\\bar\\')
  })

  it('leaves a string without leading slash unchanged', function() {
    expect(removeLeadingSlash('foo/bar/')).to.equal('foo/bar/')
  })
})
