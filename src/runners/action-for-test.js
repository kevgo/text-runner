// @flow

const actionFor = require('./action-for.js')
const { expect } = require('chai')
const scaffoldActivity = require('../../test/scaffolders/activity.js')

describe('actionFor', function () {
  context('built-in block name given', function () {
    it('returns the matching handler function', function () {
      const activity = scaffoldActivity({ type: 'cd' })
      const result = actionFor(activity)
      expect(result).to.be.a('function')
    })
  })
})
