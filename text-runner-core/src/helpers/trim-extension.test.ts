import { assert } from "chai"

import { trimExtension } from "./trim-extension"
import { unixify } from "./unixify"

test("trimExtension()", function () {
  assert.equal(unixify(trimExtension("/one/two/three.ts")), "/one/two/three")
})
