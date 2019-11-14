import { assert } from "chai"
import { parseCmdlineArgs } from "./parse-cmdline-args"

describe("parse-cmdline-args", function() {
  context("with unix <node> call", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs([
        "/usr/local/Cellar/node/9.3.0_1/bin/node",
        "/Users/kevlar/d/text-runner/bin/text-run",
        "run"
      ])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })
  })

  context("with windows <node> call", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs([
        "C:\\Program Files (x86)\\nodejs\\node.exe",
        "C:\\projects\\text-runner\\bin\\text-run.cmd\\..\\..\\dist\\cli\\cli.js",
        "run"
      ])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })

    it("returns empty files", function() {
      assert.isUndefined(this.result.file)
    })
  })

  context("with <node> and <text-run> call", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs([
        "/usr/local/Cellar/node/9.3.0_1/bin/node",
        "/Users/kevlar/d/text-runner/bin/text-run",
        "run"
      ])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })
  })

  context("with <text-run> call", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs([
        "/Users/kevlar/d/text-runner/bin/text-run",
        "run"
      ])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })
  })

  context("--offline <file>", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs([
        "--offline",
        "documentation/actions/cd.md"
      ])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })

    it('returns the "offline" switch', function() {
      assert.isTrue(this.result.offline)
    })

    it("returns the filename", function() {
      assert.equal(this.result.fileGlob, "documentation/actions/cd.md")
    })
  })

  context("<file>", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["documentation/actions/cd.md"])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })

    it("returns the filename", function() {
      assert.equal(this.result.fileGlob, "documentation/actions/cd.md")
    })
  })

  context("(no args)", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs([])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })

    it("returns undefined as the filename", function() {
      assert.isUndefined(this.result.file)
    })
  })

  context("--format dot", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["--format", "dot"])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })

    it("returns the dot formatter option", function() {
      assert.equal(this.result.formatterName, "dot")
    })
  })

  context("--workspace foo/bar", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["--workspace", "foo/bar"])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })

    it("returns the foo/bar workspace", function() {
      assert.equal(this.result.workspace, "foo/bar")
    })
  })

  context("--keep-tmp", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["--keep-tmp", "foo.md"])
    })

    it('returns the "run" command', function() {
      assert.equal(this.result.command, "run")
    })

    it("sets the keep-tmp flag", function() {
      assert.isTrue(this.result.keepTmp)
    })

    it('returns "foo.md" as the filename', function() {
      assert.equal(this.result.fileGlob, "foo.md")
    })
  })
})
