import { expect } from 'chai'
import FormattingTracker from './formatting-tracker'

describe('FormattingTracker', function() {
  it('serializes tracked formatting', function() {
    const tracker = new FormattingTracker()
    tracker.open('strong')
    tracker.open('emphasized')
    expect(tracker.toString()).to.equal('emphasizedstrong')
  })
})
