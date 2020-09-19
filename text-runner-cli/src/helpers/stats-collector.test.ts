import { assert } from "chai"
// TODO: replace with setTimeout and remove from package.json
import delay from "delay"
import * as helpers from "."
import * as events from "events"
import * as tr from "text-runner-core"

suite("StatsCollector", function () {
  test("counting activities", function () {
    const emitter = new events.EventEmitter()
    const counter = new helpers.stats.Collector(emitter)
    emitter.emit(tr.CommandEvent.failed)
    emitter.emit(tr.CommandEvent.skipped)
    emitter.emit(tr.CommandEvent.success)
    assert.equal(counter.stats().activityCount, 3)
  })

  test("counting errors", function () {
    const emitter = new events.EventEmitter()
    const counter = new helpers.stats.Collector(emitter)
    emitter.emit(tr.CommandEvent.failed)
    emitter.emit(tr.CommandEvent.failed)
    assert.equal(counter.stats().errorCount, 2)
  })

  test("counting skips", function () {
    const emitter = new events.EventEmitter()
    const counter = new helpers.stats.Collector(emitter)
    emitter.emit(tr.CommandEvent.skipped)
    emitter.emit(tr.CommandEvent.skipped)
    assert.equal(counter.stats().skipsCount, 2)
  })

  test("counting successes", function () {
    const emitter = new events.EventEmitter()
    const counter = new helpers.stats.Collector(emitter)
    emitter.emit(tr.CommandEvent.success)
    emitter.emit(tr.CommandEvent.success)
    assert.equal(counter.stats().successCount, 2)
  })

  test("counting the time", async function () {
    const emitter = new events.EventEmitter()
    const counter = new helpers.stats.Collector(emitter)
    await delay(1)
    assert.match(counter.stats().duration, /\d+.s/)
  })
})
