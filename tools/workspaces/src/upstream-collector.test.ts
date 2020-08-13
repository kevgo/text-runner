import { UpstreamInfo } from "./upstream-collector"
import { strict as assert } from "assert"

suite("UpstreamCollector", function () {
  test("workspace with upstreams", function () {
    const uf = new UpstreamInfo(["root", "dep1", "dep2"])
    uf.registerDownstream("root", "dep1")
    uf.registerDownstream("root", "dep2")
    uf.registerDownstream("dep1", "dep2")
    assert.deepEqual(uf.upstreamsFor("dep1"), ["root"])
    assert.deepEqual(uf.upstreamsFor("dep2"), ["dep1", "root"])
  })
  test("workspace with no upstreams", function () {
    const uf = new UpstreamInfo(["root", "dep1"])
    uf.registerDownstream("root", "dep1")
    assert.deepEqual(uf.upstreamsFor("root"), [])
  })
  test("registering an unknown downstream workspace", function () {
    const uf = new UpstreamInfo(["root"])
    assert.throws(() => uf.registerDownstream("root", "zonk"), "unregistered workspace: zonk")
  })
  test("registering an unknown upstream workspace", function () {
    const uf = new UpstreamInfo(["root"])
    assert.throws(() => uf.registerDownstream("zonk", "root"), "unregistered workspace: zonk")
  })
  test("fetching upstreams for an unknown workspace", function () {
    const uf = new UpstreamInfo(["root"])
    assert.throws(() => uf.upstreamsFor("zonk"), "unregistered workspace: zonk")
  })
})
