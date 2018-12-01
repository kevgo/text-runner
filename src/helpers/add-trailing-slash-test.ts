import { expect } from 'chai'
import addTrailingSlash from './add-trailing-slash'

describe('addTrailingSlash', function() {
  it('appends a slash if there is not one', function() {
    expect(addTrailingSlash('foo')).to.equal('foo/')
  })
  it('does not append a slash if there is one', function() {
    expect(addTrailingSlash('foo/')).to.equal('foo/')
  })
})
