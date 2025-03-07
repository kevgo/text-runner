/* eslint-disable no-empty-function */
import { assert } from "chai"
import { suite, test } from "node:test"

import { Actions } from "./actions.js"
import { Action } from "./index.js"

suite("Actions", () => {
  suite("register", () => {
    test("a directly exported action", () => {
      const actions = new Actions()
      const want: Action = () => 254
      actions.register("hello", want)
      const have = actions.get("hello")
      assert.equal(have, want)
    })
    test("an action exported as the default", () => {
      const actions = new Actions()
      const func: Action = () => 254
      const want = { default: func }
      actions.register("hello", want)
      const have = actions.get("hello")
      assert.equal(have, func)
    })
    test("an action exported with a name", () => {
      const actions = new Actions()
      const func: Action = () => 254
      const want = { otherName: func }
      actions.register("default", want)
      let have = actions.get("other-name")
      assert.equal(have, func)
      have = actions.get("hello")
      assert.equal(have, undefined)
    })
    test("multiple exported actions", () => {
      const actions = new Actions()
      const func1: Action = () => 254
      const func2: Action = () => 254
      const want = { evening: func2, morning: func1 }
      actions.register("default", want)
      let have = actions.get("morning")
      assert.equal(have, func1)
      have = actions.get("evening")
      assert.equal(have, func2)
      have = actions.get("default")
      assert.equal(have, undefined)
    })
  })
  suite("names", () => {
    test("no actions registered", () => {
      const actions = new Actions()
      assert.deepEqual(actions.names(), [])
    })
    test("actions registered", () => {
      const actions = new Actions()
      actions.register("two", () => {})
      actions.register("one", () => {})
      assert.deepEqual(actions.names(), ["one", "two"])
    })
  })
  suite("size", () => {
    test("no actions registered", () => {
      const actions = new Actions()
      assert.equal(actions.size(), 0)
    })
    test("actions registered", () => {
      const actions = new Actions()
      actions.register("two", () => {})
      actions.register("one", () => {})
      assert.equal(actions.size(), 2)
    })
  })
})
