import { assert } from "chai"

import { OutputCollector } from "./output-collector.js"

suite("OutputCollector", function () {
  test("initial state", function () {
    const collector = new OutputCollector()
    assert.equal(collector.toString(), "")
  })

  test("collecting strings", function () {
    const collector = new OutputCollector()
    const logFn = collector.logFn()
    logFn("hello")
    logFn("world")
    assert.equal(collector.toString(), "hello\nworld\n")
  })

  test("collecting other data types", function () {
    const collector = new OutputCollector()
    const logFn = collector.logFn()
    logFn(123)
    logFn({ a: 1 })
    assert.equal(collector.toString(), "123\n{ a: 1 }\n")
  })

  test("multiple arguments", function () {
    const collector = new OutputCollector()
    const logFn = collector.logFn()
    logFn("hello", "world")
    assert.equal(collector.toString(), "hello world\n")
  })
})
