import { expect } from "chai"
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
      expect(this.result.command).to.equal("run")
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
      expect(this.result.command).to.equal("run")
    })

    it("returns empty files", function() {
      expect(this.result.file).to.be.undefined
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
      expect(this.result.command).to.equal("run")
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
      expect(this.result.command).to.equal("run")
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
      expect(this.result.command).to.equal("run")
    })

    it('returns the "offline" switch', function() {
      expect(this.result.offline).to.be.true
    })

    it("returns the filename", function() {
      expect(this.result.fileGlob).to.equal("documentation/actions/cd.md")
    })
  })

  context("<file>", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["documentation/actions/cd.md"])
    })

    it('returns the "run" command', function() {
      expect(this.result.command).to.equal("run")
    })

    it("returns the filename", function() {
      expect(this.result.fileGlob).to.equal("documentation/actions/cd.md")
    })
  })

  context("(no args)", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs([])
    })

    it('returns the "run" command', function() {
      expect(this.result.command).to.equal("run")
    })

    it("returns undefined as the filename", function() {
      expect(this.result.file).to.be.undefined
    })
  })

  context("--format dot", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["--format", "dot"])
    })

    it('returns the "run" command', function() {
      expect(this.result.command).to.equal("run")
    })

    it("returns the dot formatter option", function() {
      expect(this.result.formatterName).to.equal("dot")
    })
  })

  context("--workspace foo/bar", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["--workspace", "foo/bar"])
    })

    it('returns the "run" command', function() {
      expect(this.result.command).to.equal("run")
    })

    it("returns the foo/bar workspace", function() {
      expect(this.result.workspace).to.equal("foo/bar")
    })
  })

  context("--keep-tmp", function() {
    beforeEach(function() {
      this.result = parseCmdlineArgs(["--keep-tmp", "foo.md"])
    })

    it('returns the "run" command', function() {
      expect(this.result.command).to.equal("run")
    })

    it("sets the keep-tmp flag", function() {
      expect(this.result.keepTmp).to.be.true
    })

    it('returns "foo.md" as the filename', function() {
      expect(this.result.fileGlob).to.equal("foo.md")
    })
  })
})
