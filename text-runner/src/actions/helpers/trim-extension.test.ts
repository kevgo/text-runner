import { assert } from "chai"
import { unixify } from "../../filesystem/helpers/unixify"
import { trimExtension } from "./trim-extension"

test("trimExtension()", function () {
  assert.equal(unixify(trimExtension("/one/two/three.ts")), "/one/two/three")
})
