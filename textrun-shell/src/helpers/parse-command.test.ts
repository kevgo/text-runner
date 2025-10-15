import { assert } from "chai"
import { suite, test } from "node:test"

import { parseCommand } from "./parse-command.js"

suite("parseCommand", () => {
  test("empty", () => {
    const have = parseCommand("", noGlobalize)
    const want = ""
    assert.equal(have, want)
  })

  test("single command", () => {
    const have = parseCommand("echo hello", noGlobalize)
    const want = "echo hello"
    assert.equal(have, want)
  })

  test("multiple commands", () => {
    const have = parseCommand("echo one\necho two", noGlobalize)
    const want = "echo one && echo two"
    assert.equal(have, want)
  })
})

function noGlobalize(x: string): string {
  return x
}
