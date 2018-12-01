import { expect } from 'chai'
import trimExtension from './trim-extension'
import unixify from './unifixy'

describe('trimExtension', function() {
  it('removes the extension from TypeScript paths', function() {
    const actual = trimExtension('/one/two/three.ts')
    expect(unixify(actual)).to.equal('/one/two/three')
  })
})
