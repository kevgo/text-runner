// @flow

const endTypeFor = require('./end-type-for.js')
const { expect } = require('chai')

describe('endTypeFor', function () {
  it('returns the closing tag', function () {
    const data = {
      heading_open: 'heading_close',
      anchor_open: 'anchor_close'
    }
    for (const input in data) {
      expect(endTypeFor(input)).to.eql(data[input])
    }
  })
})
