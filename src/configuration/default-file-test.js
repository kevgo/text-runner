/* eslint no-unused-expressions: 0 */
// @flow

const DefaultFile = require('./default-file.js')
const { expect } = require('chai')

describe('DefaultFile', function () {
  describe('isSet', function () {
    it('returns TRUE if a value is given', function () {
      const defaultFile = new DefaultFile('foo')
      expect(defaultFile.isSet()).to.be.true
    })

    it('returns FALSE if an empty value is given', function () {
      const defaultFile = new DefaultFile('')
      expect(defaultFile.isSet()).to.be.false
    })
  })
})
