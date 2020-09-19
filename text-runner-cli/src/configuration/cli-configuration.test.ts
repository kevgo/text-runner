import { assert } from "chai"
import { CLIConfiguration } from "./cli-configuration"

suite("CLIConfiguration", function () {
  suite("merge", function () {
    test("empty inputs", function () {
      const config = new CLIConfiguration()
      const have = config.merge(new CLIConfiguration())
      const want = new CLIConfiguration()
      assert.deepEqual(have, want)
    })

    test("userConfig overrides fileConfig", function () {
      const config = new CLIConfiguration({
        formatterName: "dot",
        files: "**/*.md",
        online: true,
      })
      const other = new CLIConfiguration({
        files: "1.md",
        online: false,
      })
      const result = config.merge(other)
      assert.deepEqual(
        result,
        new CLIConfiguration({
          formatterName: "dot",
          files: "1.md",
          online: false,
        })
      )
    })
  })

  test("toConfig", function () {
    const userConfig = new CLIConfiguration({
      files: "1.md",
      regionMarker: "foo",
    })
    const have = userConfig.toCoreConfig()
    assert.equal(have.files, "1.md")
    assert.equal(have.regionMarker, "foo")
  })
})
