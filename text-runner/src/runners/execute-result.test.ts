import { ExecuteResult } from "./execute-result"
import { strict as assert } from "assert"
import { ActivityResult } from "../activity-list/types/activity-result"

suite("ExecuteResult", function () {
  test("empty", function () {
    const have = ExecuteResult.empty()
    assert.deepEqual(have.activityResults, [])
    assert.equal(have.errorCount, 0)
  })
  test("merge", function () {
    const have = ExecuteResult.empty()
    const activity: ActivityResult = }
    const give = new ExecuteResult([])
    have.add})
    assert.deepEqual(have.activityResults, [])
    assert.equal(have.errorCount, 0)
  })
})
