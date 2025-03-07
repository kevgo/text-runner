import { assert } from "chai"
import { suite, test } from "node:test"

import * as cmdLine from "./cmdline.js"

suite("parseCmdlineArgs()", () => {
  test("with unix <node> call", () => {
    const have = cmdLine.parse([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-runner",
      "run"
    ])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("with windows <node> call", () => {
    const have = cmdLine.parse([
      "C:\\Program Files (x86)\\nodejs\\node.exe",
      "C:\\projects\\text-runner\\bin\\text-runner.cmd\\..\\..\\dist\\index.js",
      "run"
    ])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("with <node> and <text-runner> call", () => {
    const have = cmdLine.parse([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-runner",
      "run"
    ])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("with <text-runner> call", () => {
    const have = cmdLine.parse(["/Users/kevlar/d/text-runner/bin/text-runner", "run"])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("--online <file>", () => {
    const have = cmdLine.parse(["--online", "documentation/actions/cd.md"])
    assert.equal(have.commandName, "run")
    assert.isTrue(have.cmdLineConfig.online)
    assert.equal(have.cmdLineConfig.files, "documentation/actions/cd.md")
  })

  test("<file>", () => {
    const have = cmdLine.parse(["documentation/actions/cd.md"])
    assert.equal(have.commandName, "run")
    assert.equal(have.cmdLineConfig.files, "documentation/actions/cd.md")
  })

  test("(no args)", () => {
    const { cmdLineConfig: config, commandName: command } = cmdLine.parse([])
    assert.equal(command, "run")
    assert.isUndefined(config.files)
  })

  test("--format=dot", () => {
    const { cmdLineConfig, commandName } = cmdLine.parse(["--format=dot"])
    assert.equal(commandName, "run")
    assert.equal(cmdLineConfig.format, "dot")
  })

  test("--workspace foo/bar", () => {
    const { cmdLineConfig, commandName } = cmdLine.parse(["--workspace=foo/bar"])
    assert.equal(commandName, "run")
    assert.equal(cmdLineConfig.workspace, "foo/bar")
  })
})
