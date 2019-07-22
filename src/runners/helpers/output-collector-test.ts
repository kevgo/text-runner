import { strict as assert } from "assert"
import { OutputCollector } from "./output-collector"

describe("OutputCollector", function() {
  it("starts out empty", function() {
    const collector = new OutputCollector()
    assert.equal(collector.toString(), "")
  })

  it("collects givon output", function() {
    const collector = new OutputCollector()
    const logFn = collector.logFn()
    logFn("hello")
    logFn("world")
    assert.equal(collector.toString(), "hello\nworld\n")
  })

  it("supports other data types", function() {
    const collector = new OutputCollector()
    const logFn = collector.logFn()
    logFn(123)
    logFn({ a: 1 })
    assert.equal(collector.toString(), "123\n{ a: 1 }\n")
  })
  it("supports multiple arguments", function() {
    const collector = new OutputCollector()
    const logFn = collector.logFn()
    logFn("hello", "world")
    assert.equal(collector.toString(), "hello world\n")
  })
})
