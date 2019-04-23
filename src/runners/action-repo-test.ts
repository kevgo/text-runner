import { expect } from 'chai'
import { actionRepo } from '../../dist/runners/action-repo'
import { scaffoldActivity } from '../activity-list/activity'

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
        'cd-back',
        'cd-into-empty-tmp-folder',
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
