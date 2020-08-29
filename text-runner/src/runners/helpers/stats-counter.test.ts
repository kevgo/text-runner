import { assert } from "chai"
import delay from "delay"
import { StatsCounter } from "./stats-counter"

suite("StatsCounter", function () {
  test("counting activities", function () {
    const counter = new StatsCounter(0)
    counter.error()
    counter.skip()
    counter.success()
    assert.equal(counter.activities(), 3)
  })

  test("counting errors", function () {
    const counter = new StatsCounter(0)
    counter.error()
    counter.error()
    assert.equal(counter.errors(), 2)
  })

  test("counting files", function () {
    const counter = new StatsCounter(3)
    assert.equal(counter.files(), 3)
  })

  test("counting skips", function () {
    const counter = new StatsCounter(0)
    counter.skip()
    counter.skip()
    assert.equal(counter.skips(), 2)
  })

  test("counting successes", function () {
    const counter = new StatsCounter(0)
    counter.success()
    counter.success()
    assert.equal(counter.successes(), 2)
  })

  test("counting the time", async function () {
    const counter = new StatsCounter(0)
    await delay(1)
    assert.match(counter.duration(), /\d+.s/)
  })
})
