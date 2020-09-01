import { World } from "cucumber"
import { flatten } from "array-flatten"
import { assert } from "chai"
import { setWorldConstructor } from "cucumber"
import * as fs from "fs"
import * as glob from "glob"
import * as path from "path"
import stripAnsi = require("strip-ansi")
import { standardizePath } from "./helpers/standardize-path"
import { ObservableProcess } from "observable-process"

/** World is the shared data structure that is provided as `this` to Cucumber steps. */
export interface TRWorld {
  /** the currently running subshell process */
  process: ObservableProcess | undefined
  rootDir: string
  debug: boolean
  verbose: boolean
}

/**
 * World provides step implementations that run and test TextRunner
 * via its command-line interface
 */
function World() {
  this.verifyRanOnlyTests = (filenames: any) => {
    filenames = flatten(filenames)
    const standardizedOutput = this.process.output.fullText().replace(/\\/g, "/")

    // verify the given tests have run
    for (const filename of filenames) {
      assert.include(standardizedOutput, filename)
    }

    // verify all other tests have not run
    const filesShouldntRun = glob
      .sync(`${this.rootDir}/**`)
      .filter((file) => fs.statSync(file).isFile())
      .map((file) => path.relative(this.rootDir, file))
      .filter((file) => file)
      .map((file) => file.replace(/\\/g, "/"))
      .filter((file) => filenames.indexOf(file) === -1)
    for (const fileShouldntRun of filesShouldntRun) {
      assert.notInclude(standardizedOutput, fileShouldntRun)
    }
  }

  this.verifyTestsRun = (count: number) => {
    assert.include(stripAnsi(this.process.output.fullText()), ` ${count} activities`)
  }
}

setWorldConstructor(World)
