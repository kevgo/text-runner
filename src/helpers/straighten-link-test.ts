import { expect } from "chai"
import { describe, it } from "mocha"
import straightenLink from "./straighten-link.js"

describe("straightenPath", function() {
  const tests = {
    "returns normal paths": { "/foo": "/foo" },
    "with current dir": { "/one/./././two/./": "/one/two/" },
    "goes upward": { "/one/../two": "/two" },
    "goes upward with double slash": { "/one//../two": "/two" },
    "several upwards together": { "/one/two/three/../../four": "/one/four" },
    "several individual upwards": { "/one/two/../three/../four": "/one/four" }
  }
  for (const [description, testData] of Object.entries(tests)) {
    const [input, expected] = Object.entries(testData)[0]
    it(description, function() {
      expect(straightenLink(input)).to.equal(expected)
    })
  }
})
