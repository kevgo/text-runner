import { World } from "cucumber"
import { setWorldConstructor } from "cucumber"
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
