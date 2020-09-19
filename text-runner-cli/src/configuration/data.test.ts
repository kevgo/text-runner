import { assert } from "chai"
import { Data } from "./data"

suite("CLIConfiguration", function () {
  suite("merge", function () {
    test("empty inputs", function () {
      const config = new Data()
      const have = config.merge(new Data())
      const want = new Data()
      assert.deepEqual(have, want)
    })

    test("userConfig overrides fileConfig", function () {
      const config = new Data({
        formatterName: "dot",
        files: "**/*.md",
        online: true,
      })
      const other = new Data({
        files: "1.md",
        online: false,
      })
      const result = config.merge(other)
      assert.deepEqual(
        result,
        new Data({
          formatterName: "dot",
          files: "1.md",
          online: false,
        })
      )
    })
  })

  test("toConfig", function () {
    const userConfig = new Data({
      files: "1.md",
      regionMarker: "foo",
    })
    const have = userConfig.toCoreConfig()
    assert.equal(have.files, "1.md")
    assert.equal(have.regionMarker, "foo")
  })
})
