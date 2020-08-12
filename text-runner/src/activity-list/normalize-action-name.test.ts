import { normalizeActionName } from "./normalize-action-name"
import { strict as assert } from "assert"

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
      assert.equal(normalizeActionName(give), want)
    })
  }
})
