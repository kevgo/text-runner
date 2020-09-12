import { assert } from "chai"
import { parseCmdlineArgs } from "./parse-cmdline-args"

suite("parseCmdlineArgs()", function () {
  test("with unix <node> call", function () {
    const have = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run",
    ])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("with windows <node> call", function () {
    const have = parseCmdlineArgs([
      "C:\\Program Files (x86)\\nodejs\\node.exe",
      "C:\\projects\\text-runner\\bin\\text-run.cmd\\..\\..\\dist\\cli.js",
      "run",
    ])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("with <node> and <text-run> call", function () {
    const have = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run",
    ])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("with <text-run> call", function () {
    const have = parseCmdlineArgs([
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run",
    ])
    assert.equal(have.commandName, "run")
    assert.isUndefined(have.cmdLineConfig.files)
  })

  test("--online <file>", function () {
    const have = parseCmdlineArgs([
      "--online",
      "documentation/actions/cd.md",
    ])
    assert.equal(have.commandName, "run")
    assert.isTrue(have.cmdLineConfig.online)
    assert.equal(have.cmdLineConfig.files, "documentation/actions/cd.md")
  })

  test("<file>", function () {
    const have = parseCmdlineArgs(["documentation/actions/cd.md"])
    assert.equal(have.commandName, "run")
    assert.equal(have.cmdLineConfig.files, "documentation/actions/cd.md")
  })

  test("(no args)", function () {
    const { commandName: command, cmdLineConfig: config } = parseCmdlineArgs([])
    assert.equal(command, "run")
    assert.isUndefined(config.files)
  })

  test("--format dot", function () {
    const { commandName: command, cmdLineConfig: config } = parseCmdlineArgs(["--format", "dot"])
    assert.equal(command, "run")
    assert.equal(config.formatterName, "dot")
  })

  test("--workspace foo/bar", function () {
    const { commandName: command, cmdLineConfig: config } = parseCmdlineArgs(["--workspace", "foo/bar"])
    assert.equal(command, "run")
    assert.equal(config.workspace, "foo/bar")
  })
})
