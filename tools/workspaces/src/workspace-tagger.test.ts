import { WorkspaceTagger } from "./workspace-tagger"
import { strict as assert } from "assert"

suite("WorkspaceTagger", function () {
  suite("tagFile", function () {
    test("in workspace", function () {
      const wst = new WorkspaceTagger(["one", "two", "three"])
      wst.tagFile("three/foo.md")
      wst.tagFile("one/bar.md")
      assert.deepEqual(wst.tagged(), ["one", "three"])
    })
    test("in non-workspace folder", function () {
      const wst = new WorkspaceTagger(["one", "two"])
      wst.tagFile("other/zonk.md")
      assert.deepEqual(wst.tagged(), ["."])
    })
  })
  suite("tagFiles", function () {
    test("in workspace", function () {
      const wst = new WorkspaceTagger(["one", "two", "three"])
      wst.tagFiles(["three/foo.md", "one/bar.md"])
      assert.deepEqual(wst.tagged(), ["one", "three"])
    })
    test("in non-workspace folder", function () {
      const wst = new WorkspaceTagger(["one", "two"])
      wst.tagFiles(["zonk.md"])
      assert.deepEqual(wst.tagged(), ["."])
    })
  })

  suite("tagWorkspace", function () {
    test("existing workspace", function () {
      const wst = new WorkspaceTagger(["one", "two", "three"])
      wst.tagWorkspace("three")
      wst.tagWorkspace("one")
      assert.deepEqual(wst.tagged(), ["one", "three"])
    })
    test("non-workspace folder", function () {
      const wst = new WorkspaceTagger(["one", "two"])
      wst.tagWorkspace("zonk")
      assert.deepEqual(wst.tagged(), ["."])
    })
  })

  suite("tagWorkspaces", function () {
    test("existing workspaces", function () {
      const wst = new WorkspaceTagger(["one", "two", "three"])
      wst.tagWorkspaces(["three", "one"])
      assert.deepEqual(wst.tagged(), ["one", "three"])
    })
    test("non-workspace folder", function () {
      const wst = new WorkspaceTagger(["one", "two"])
      wst.tagWorkspaces(["two", "zonk"])
      assert.deepEqual(wst.tagged(), ["two", "."])
    })
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
