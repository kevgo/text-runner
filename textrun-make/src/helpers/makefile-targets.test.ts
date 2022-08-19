import { assert } from "chai"

import { makefileTargets } from "./makefile-targets.js"

suite("makefileTargets", function () {
  test("with tabs", function () {
    const give = `\
foo:  # builds the foo target
\techo building foo

bar:
\techo building bar
`
    assert.deepEqual(makefileTargets(give), ["bar", "foo"])
  })

  test("line contains column", function () {
    const give = `\
help:   # shows all available Make commands
\tcat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the code base
`
    assert.deepEqual(makefileTargets(give), ["help", "lint"])
  })

  test("Makefile contains hidden targets", function () {
    const give = `\
.PHONY: test

foo:`
    assert.deepEqual(makefileTargets(give), ["foo"])
  })
})
