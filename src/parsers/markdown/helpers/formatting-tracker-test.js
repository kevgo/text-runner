// @flow

const FormattingTracker = require('./formatting-tracker.js')
const { expect } = require('chai')

describe('FormattingTracker', function () {
  it('serializes tracked formatting', function () {
    const tracker = new FormattingTracker()
    tracker.open('strong')
    tracker.open('emphasized')
    expect(tracker.toString()).to.equal('emphasizedstrong')
  })
})
