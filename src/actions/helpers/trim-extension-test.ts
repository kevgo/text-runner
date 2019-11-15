import { assert } from "chai"
import { unixify } from "../../filesystem/helpers/unixify"
import { trimExtension } from "./trim-extension"

test("trimExtension", function() {
  const actual = trimExtension("/one/two/three.ts")
  assert.equal(unixify(actual), "/one/two/three")
})
