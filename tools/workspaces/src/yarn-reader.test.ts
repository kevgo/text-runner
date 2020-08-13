import { YarnReader, YarnOutput } from "./yarn-reader"
import { strict as assert } from "assert"

suite("YarnReader", function () {
  test("downstreamsFor normal", function () {
    const yarnOutput: YarnOutput = {
      a: {
        location: "a path",
        workspaceDependencies: ["b"],
      },
      b: {
        location: "b path",
        workspaceDependencies: ["c"],
      },
      c: {
        location: "c path",
        workspaceDependencies: [],
      },
    }
    const uf = new YarnReader(yarnOutput)
    assert.deepEqual(uf.downstreamsFor("a path"), [])
    assert.deepEqual(uf.downstreamsFor("b path"), ["a path"])
    assert.deepEqual(uf.downstreamsFor("c path"), ["a path", "b path"])
    assert.throws(() => uf.downstreamsFor("zonk"), "unregistered workspace: zonk")
  })
  test("downstreamsFor with cyclical dependency", function () {
    const yarnOutput: YarnOutput = {
      a: {
        location: "a path",
        workspaceDependencies: ["b"],
      },
      b: {
        location: "b path",
        workspaceDependencies: ["a"],
      },
    }
    const uf = new YarnReader(yarnOutput)
    assert.deepEqual(uf.downstreamsFor("a path"), ["b path"])
    assert.deepEqual(uf.downstreamsFor("b path"), ["a path"])
  })
  test("pathsFor", function () {
    const yarnOutput: YarnOutput = {
      a: {
        location: "a path",
        workspaceDependencies: [],
      },
      b: {
        location: "b path",
        workspaceDependencies: [],
      },
    }
    const uf = new YarnReader(yarnOutput)
    assert.deepEqual(uf.pathsFor(["b", "a"]), ["a path", "b path"])
  })
})
