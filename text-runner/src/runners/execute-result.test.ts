import { ExecuteResult } from "./execute-result"
import { strict as assert } from "assert"
import { ActivityResult, scaffoldActivityResult } from "../activity-list/types/activity-result"

suite("ExecuteResult", function () {
  test("empty", function () {
    const have = ExecuteResult.empty()
    assert.deepEqual(have.activityResults, [])
    assert.equal(have.errorCount, 0)
  })
  test("new", function () {
    const activityResult = scaffoldActivityResult()
    const have = new ExecuteResult([activityResult], 3)
    assert.deepEqual(have.activityResults, [activityResult])
    assert.equal(have.errorCount, 3)
  })
  test("merge", function () {
    const activityResult1 = scaffoldActivityResult()
    const existing = new ExecuteResult([activityResult1], 3)
    const activityResult2 = scaffoldActivityResult()
    const activityResult3 = scaffoldActivityResult()
    const other1 = new ExecuteResult([activityResult2], 4)
    const other2 = new ExecuteResult([activityResult3], 5)
    const have = existing.mergeMany([other1, other2])
    assert.deepEqual(have.activityResults, [activityResult1, activityResult2, activityResult3])
    assert.equal(have.errorCount, 12)
  })
})
