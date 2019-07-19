import { expect } from 'chai'
import { scaffoldActivity } from '../activity-list/activity'
import { actionRepo } from './action-repo'

describe('actionRepo', function() {
  describe('actionFor', function() {
    context('built-in block name given', function() {
      it('returns the matching handler function', function() {
        const activity = scaffoldActivity({ actionName: 'cd' })
        const result = actionRepo.actionFor(activity)
        expect(result).to.be.a('function')
      })
    })
  })
  describe('customActionNames', function() {
    it('returns the names of all built-in actions', function() {
      const result = actionRepo.customActionNames()
      expect(result).to.eql([
        'cd-into-empty-tmp-folder',
        'cd-workspace',
        'create-markdown-file',
        'run-markdown-in-textrun',
        'run-textrun',
        'verify-ast-node-attributes',
        'verify-handler-args',
        'verify-make-command',
        'verify-searcher-methods'
      ])
    })
  })
})
