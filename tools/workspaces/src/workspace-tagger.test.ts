import { WorkspaceTagger } from "./workspace-tagger"
import { strict as assert } from "assert"

suite("WorkspaceTagger", function () {
  test("tagging workspace folders", function () {
    const wst = new WorkspaceTagger(["one", "two", "three"])
    wst.tagMany(["three", "one"])
    assert.deepEqual(wst.tagged(), ["one", "three"])
  })
  test("tagging non-workspace folders", function () {
    const wst = new WorkspaceTagger(["one", "two"])
    wst.tagMany(["two", "zonk"])
    assert.deepEqual(wst.tagged(), ["two", "."])
  })
  suite("workspaceOf", function () {
    const tests = {
      "examples/one/README.md": "examples/one",
      "examples/two/foo/bar/README.md": "examples/two",
      "README.md": ".",
    }
    const wst = new WorkspaceTagger(["examples/one", "examples/two", "tools/three"])
    for (const [give, want] of Object.entries(tests)) {
      test(`${give} --> ${want}`, function () {
        assert.equal(wst.workspaceOf(give), want)
      })
    }
  })
})
