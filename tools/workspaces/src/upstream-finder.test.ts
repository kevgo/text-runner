import { UpstreamFinder } from "./upstream-finder"
import { strict as assert } from "assert"

suite("UpstreamFinder", function () {
  test("workspace with upstreams", function () {
    const uf = new UpstreamFinder()
    uf.registerDownstream("root", "dep1")
    uf.registerDownstream("root", "dep2")
    uf.registerDownstream("dep1", "dep2")
    assert.deepEqual(uf.upstreamsFor("dep1"), ["root"])
    assert.deepEqual(uf.upstreamsFor("dep2"), ["dep1", "root"])
  })
})
