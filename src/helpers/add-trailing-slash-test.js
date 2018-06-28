// @flow

const addTrailingSlash = require('./add-trailing-slash.js')
const { expect } = require('chai')

describe('addTrailingSlash', function () {
  it('appends a slash if there is not one', function () {
    expect(addTrailingSlash('foo')).to.equal('foo/')
  })
  it('does not append a slash if there is one', function () {
    expect(addTrailingSlash('foo/')).to.equal('foo/')
  })
})
