import { assert } from "chai"
import { suite, test } from "node:test"

import * as configuration from "./configuration.js"

suite("CLIConfiguration", function() {
  suite("merge", function() {
    test("empty inputs", function() {
      const config = new configuration.Data()
      const have = config.merge(new configuration.Data())
      const want = new configuration.Data()
      assert.deepEqual(have, want)
    })

    test("userConfig overrides fileConfig", function() {
      const fileConfig = new configuration.Data({
        files: "**/*.md",
        format: "dot",
        online: true
      })
      const userConfig = new configuration.Data({
        files: "1.md",
        online: false
      })
      const result = fileConfig.merge(userConfig)
      assert.deepEqual(
        result,
        new configuration.Data({
          files: "1.md",
          format: "dot",
          online: false
        })
      )
    })
  })

  test("toConfig", function() {
    const userConfig = new configuration.Data({
      files: "1.md",
      regionMarker: "foo"
    })
    const have = userConfig.toEngineConfig()
    assert.equal(have.files, "1.md")
    assert.equal(have.regionMarker, "foo")
  })
})
