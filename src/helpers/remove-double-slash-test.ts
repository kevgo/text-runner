import { expect } from 'chai'
import removeDoubleSlash from './remove-double-slash'

describe('removeDoubleSlash', function() {
  it('removes double slashes', function() {
    expect(removeDoubleSlash('/foo//bar/')).to.equal('/foo/bar/')
  })
})
