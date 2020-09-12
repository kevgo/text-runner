import { assert } from "chai"
import delay from "delay"
import { StatsCollector } from "./stats-collector"
import { EventEmitter } from "events"
import { CommandEvent } from "./commands/command"

suite("StatsCollector", function () {
  test("counting activities", function () {
    const emitter = new EventEmitter()
    const counter = new StatsCollector(emitter)
    emitter.emit(CommandEvent.failed)
    emitter.emit(CommandEvent.skipped)
    emitter.emit(CommandEvent.success)
    assert.equal(counter.stats().activityCount, 3)
  })

  test("counting errors", function () {
    const emitter = new EventEmitter()
    const counter = new StatsCollector(emitter)
    emitter.emit(CommandEvent.failed)
    emitter.emit(CommandEvent.failed)
    assert.equal(counter.stats().errorCount, 2)
  })

  test("counting skips", function () {
    const emitter = new EventEmitter()
    const counter = new StatsCollector(emitter)
    emitter.emit(CommandEvent.skipped)
    emitter.emit(CommandEvent.skipped)
    assert.equal(counter.stats().skipsCount, 2)
  })

  test("counting successes", function () {
    const emitter = new EventEmitter()
    const counter = new StatsCollector(emitter)
    emitter.emit(CommandEvent.success)
    emitter.emit(CommandEvent.success)
    assert.equal(counter.stats().successCount, 2)
  })

  test("counting the time", async function () {
    const emitter = new EventEmitter()
    const counter = new StatsCollector(emitter)
    await delay(1)
    assert.match(counter.stats().duration, /\d+.s/)
  })
})
