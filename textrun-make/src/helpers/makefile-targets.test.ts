import { strict as assert } from "assert"
import { makefileTargets } from "./makefile-targets"

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
})
