import { assert } from "chai"
// TODO: replace with setTimeout and remove from package.json
import * as helpers from "."
import * as tr from "text-runner-core"
import * as util from "util"
const delay = util.promisify(setTimeout)

suite("StatsCollector", function () {
  test("counting activities", function () {
    const command = new tr.commands.Run({})
    const counter = new helpers.StatsCollector(command)
    command.emit("failed", "")
    command.emit("skipped", "")
    command.emit("success", "")
    assert.equal(counter.stats().activityCount, 3)
  })

  test("counting errors", function () {
    const command = new tr.commands.Run({})
    const counter = new helpers.StatsCollector(command)
    command.emit("failed", "")
    command.emit("failed", "")
    assert.equal(counter.stats().errorCount, 2)
  })

  test("counting skips", function () {
    const command = new tr.commands.Run({})
    const counter = new helpers.StatsCollector(command)
    command.emit("skipped", "")
    command.emit("skipped", "")
    assert.equal(counter.stats().skipsCount, 2)
  })

  test("counting successes", function () {
    const command = new tr.commands.Run({})
    const counter = new helpers.StatsCollector(command)
    command.emit("success", "")
    command.emit("success", "")
    assert.equal(counter.stats().successCount, 2)
  })

  test("counting the time", async function () {
    const command = new tr.commands.Run({})
    const counter = new helpers.StatsCollector(command)
    await delay(1)
    assert.match(counter.stats().duration, /\d+.s/)
  })
})
