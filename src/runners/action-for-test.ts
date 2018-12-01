import { expect } from 'chai'
import actionFor from '../../dist/runners/action-for'
import { scaffoldActivity } from '../activity-list/activity'

describe('actionFor', function() {
  context('built-in block name given', function() {
    it('returns the matching handler function', function() {
      const activity = scaffoldActivity({ type: 'cd' })
      const result = actionFor(activity)
      expect(result).to.be.a('function')
    })
  })
})
