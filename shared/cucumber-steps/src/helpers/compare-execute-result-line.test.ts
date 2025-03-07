import { assert } from "chai"
import { suite, test } from "node:test"

import { ExecuteResultLine } from "../then-steps.js"
import { compareExecuteResultLine } from "./compare-execute-result-line.js"

suite("executeResultLine", () => {
  test("different files", () => {
    const a: ExecuteResultLine = {
      filename: "1.md",
      line: 1
    }
    const b: ExecuteResultLine = {
      filename: "2.md",
      line: 1
    }
    assert.equal(compareExecuteResultLine(a, b), -1)
    assert.equal(compareExecuteResultLine(b, a), 1)
    assert.equal(compareExecuteResultLine(a, a), 0)
  })
  test("same file different lines", () => {
    const a: ExecuteResultLine = {
      filename: "1.md",
      line: 1
    }
    const b: ExecuteResultLine = {
      filename: "1.md",
      line: 2
    }
    assert.equal(compareExecuteResultLine(a, b), -1)
    assert.equal(compareExecuteResultLine(b, a), 1)
    assert.equal(compareExecuteResultLine(a, a), 0)
  })
  test("same file same lines", () => {
    const a: ExecuteResultLine = {
      filename: "1.md",
      line: 1
    }
    assert.equal(compareExecuteResultLine(a, a), 0)
  })
})
