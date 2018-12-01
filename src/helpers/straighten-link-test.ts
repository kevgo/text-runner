import { expect } from 'chai'
import straightenLink from './straighten-link'

describe('straightenPath', function() {
  const tests = {
    'goes upward': { '/one/../two': '/two' },
    'goes upward with double slash': { '/one//../two': '/two' },
    'returns normal paths': { '/foo': '/foo' },
    'several individual upwards': { '/one/two/../three/../four': '/one/four' },
    'several upwards together': { '/one/two/three/../../four': '/one/four' },
    'with current dir': { '/one/./././two/./': '/one/two/' }
  }
  for (const [description, testData] of Object.entries(tests)) {
    const [input, expected] = Object.entries(testData)[0]
    it(description, function() {
      expect(straightenLink(input)).to.equal(expected)
    })
  }
})
