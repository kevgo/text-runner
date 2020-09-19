import { assert } from "chai"
import { Configuration } from "./configuration"

suite("Configuration", function () {
  suite("merge", function () {
    test("empty inputs", function () {
      const config = new Configuration()
      const have = config.merge(new Configuration())
      const want = new Configuration()
      assert.deepEqual(have, want)
    })

    test("userConfig overrides fileConfig", function () {
      const config = new Configuration({
        formatterName: "dot",
        files: "**/*.md",
        online: true,
      })
      const other = new Configuration({
        files: "1.md",
        online: false,
      })
      const result = config.merge(other)
      assert.deepEqual(
        result,
        new Configuration({
          formatterName: "dot",
          files: "1.md",
          online: false,
        })
      )
    })
  })

  test("toConfig", function () {
    const userConfig = new Configuration({
      files: "1.md",
      regionMarker: "foo",
    })
    const have = userConfig.toCoreConfig()
    assert.equal(have.files, "1.md")
    assert.equal(have.regionMarker, "foo")
  })
})
