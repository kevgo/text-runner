const minimum = require('../../dist/helpers/minimum.js')

describe('minimum', function () {
  context('array given', function () {
    it('returns the smallest of the given numbers', function () {
      expect(minimum([4, 1, 3, 2])).to.equal(1)
    })
  })

  context('number given', function () {
    it('returns the number', function () {
      expect(minimum(6)).to.equal(6)
    })
  })
})
