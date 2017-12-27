const minimum = require('../../dist/helpers/minimum.js')

describe('minimum', function () {
  it('returns the smallest of the given numbers', function () {
    expect(minimum([4, 1, 3, 2])).to.equal(1)
  })
})
