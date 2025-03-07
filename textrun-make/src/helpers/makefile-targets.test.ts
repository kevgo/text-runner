import { assert } from "chai"
import { suite, test } from "node:test"

import { makefileTargets } from "./makefile-targets.js"

suite("makefileTargets", () => {
  test("with tabs", () => {
    const give = `\
foo:  # builds the foo target
\techo building foo

bar:
\techo building bar
`
    assert.deepEqual(makefileTargets(give), ["bar", "foo"])
  })

  test("line contains column", () => {
    const give = `\
help:   # shows all available Make commands
\tcat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the code base
`
    assert.deepEqual(makefileTargets(give), ["help", "lint"])
  })

  test("Makefile contains hidden targets", () => {
    const give = `\
.PHONY: test

foo:`
    assert.deepEqual(makefileTargets(give), ["foo"])
  })
})
