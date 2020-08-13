import { strict as assert } from "assert"
import { rootFolder } from "./root-folder"

suite("rootFolder", function () {
  const tests = {
    foo: ".",
    ".config": ".",
    "foo/bar/baz.md": "foo",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(rootFolder(give), want)
    })
  }
})
