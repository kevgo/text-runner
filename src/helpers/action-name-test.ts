import { expect } from 'chai'
import { getActionName } from './get-action-name'

describe('actionName', function() {
  it('returns the name of the action corresponding to the given filename', function() {
    const result = getActionName('/d/text-runner/text-run/cdBack.js')
    expect(result).to.equal('cd-back')
  })
})
