import { expect } from 'chai'
import { unixify } from './unixify'

describe('unifixy', function() {
  it('converts Windows paths to Unix paths', function() {
    expect(unixify('\\foo\\bar\\')).to.equal('/foo/bar/')
  })
  it('leaves Unix paths alone', function() {
    expect(unixify('/foo/bar/')).to.equal('/foo/bar/')
  })
  it('handles mixed path styles', function() {
    expect(unixify('/foo\\bar/')).to.equal('/foo/bar/')
  })
})
