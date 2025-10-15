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
    const have = parseCommand("echo one\necho two\necho three", noGlobalize)
    const want = "echo one && echo two && echo three"
    assert.equal(have, want)
  })

  test("one", () => {
    const have = parseCommand("myapp foo", fakeGlobalize)
    const want = "/globalized/path/myapp foo"
    assert.equal(have, want)
  })
})

function noGlobalize(x: string): string {
  return x
}

function fakeGlobalize(x: string): string {
  return `/globalized/path/${x}`
}
