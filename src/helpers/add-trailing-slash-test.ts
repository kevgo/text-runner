import addTrailingSlash from './add-trailing-slash.js'
import { expect } from 'chai'

describe('addTrailingSlash', function() {
  it('appends a slash if there is not one', function() {
    expect(addTrailingSlash('foo')).to.equal('foo/')
  })
  it('does not append a slash if there is one', function() {
    expect(addTrailingSlash('foo/')).to.equal('foo/')
  })
})
