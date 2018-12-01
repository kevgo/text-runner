import { expect } from 'chai'
import removeLeadingSlash from './remove-leading-slash'

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
