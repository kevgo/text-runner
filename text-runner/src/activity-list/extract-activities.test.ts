import { assert } from "chai"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { extractActivities } from "./extract-activities"

suite("extractActivities()", function () {
  test("many activities", function () {
    const input = new AstNodeList()
    input.pushNode({
      attributes: { textrun: "verify-foo" },
      file: "README.md",
      line: 3,
      type: "anchor_open",
    })
    input.pushNode({ type: "text" })
    input.pushNode({ type: "anchor_close" })

    const result = extractActivities([input], "textrun")

    assert.lengthOf(result, 1)
    assert.equal(result[0].actionName, "verify-foo")
    assert.equal(result[0].file.unixified(), "README.md")
    assert.equal(result[0].line, 3)
    assert.deepEqual(result[0].region, input)
  })

  const tests = [
    { give: "verifyFoo", want: "verify-foo" },
    { give: "verify-foo", want: "verify-foo" },
    { give: "verify_foo", want: "verify-foo" },
  ]
  for (const tt of tests) {
    test(`normalizes activity name ${tt.give}`, function () {
      const AST = new AstNodeList()
      AST.pushNode({
        attributes: { textrun: "verify_foo" },
      })
      AST.pushNode({ type: "anchor_close" })
      const result = extractActivities([AST], "textrun")
      assert.equal(result[0].actionName, tt.want)
    })
  }
})
