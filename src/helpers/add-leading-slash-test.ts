import { expect } from 'chai'
import addLeadingSlash from './add-leading-slash'

describe('addLeadingSlash', function() {
  it('adds a leading slash if missing', function() {
    expect(addLeadingSlash('foo')).to.equal('/foo')
  })

  it('does not add a slash if one is already there', function() {
    expect(addLeadingSlash('/foo')).to.equal('/foo')
  })
})
