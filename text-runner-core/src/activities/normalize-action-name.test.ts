import { normalizeActionName } from "./normalize-action-name"
import { assert } from "chai"
import { AbsoluteFilePath } from "../filesystem/absolute-file-path"

suite("normalizeActionName", function () {
  const tests = {
    "hello-world": "hello-world",
    helloWorld: "hello-world",
    HelloWorld: "hello-world",
    "demo/HelloWorld": "demo/hello-world",
    "demo/helloWorld": "demo/hello-world",
    "demo/hello-world": "demo/hello-world",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(give, function () {
      assert.equal(normalizeActionName(give, new AbsoluteFilePath(""), 1), want)
    })
  }
})
