import { assert } from "chai"
import delay from "delay"
import { StatsCounter } from "./stats-counter"

describe("StatsCounter", function() {
  it("counts the number of errors", function() {
    const counter = new StatsCounter()
    counter.error()
    counter.error()
    assert.equal(counter.errors(), 2)
  })
  it("counts the number of skips", function() {
    const counter = new StatsCounter()
    counter.skip()
    counter.skip()
    assert.equal(counter.skips(), 2)
  })
  it("counts the number of successes", function() {
    const counter = new StatsCounter()
    counter.success()
    counter.success()
    assert.equal(counter.successes(), 2)
  })
  it("counts the time", async function() {
    const counter = new StatsCounter()
    await delay(1)
    assert.match(counter.duration(), /\d+.s/)
  })
})
