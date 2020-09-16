import { flatten } from "array-flatten"
import { assert } from "chai"
import * as fs from "fs"
import * as glob from "glob"
import * as path from "path"
import { TRWorld } from "../world"

export function verifyRanOnlyTestsCLI(filenames: any, world: TRWorld) {
  filenames = flatten(filenames)
  if (!world.process) {
    throw new Error("no process output found")
  }
  const standardizedOutput = world.process.output.fullText().replace(/\\/g, "/")

  // verify the given tests have run
  for (const filename of filenames) {
    assert.include(standardizedOutput, filename)
  }

  // verify all other tests have not run
  const filesShouldntRun = glob
    .sync(`${world.rootDir}/**`)
    .filter((file) => fs.statSync(file).isFile())
    .map((file) => path.relative(world.rootDir, file))
    .filter((file) => file)
    .map((file) => file.replace(/\\/g, "/"))
    .filter((file) => filenames.indexOf(file) === -1)
  for (const fileShouldntRun of filesShouldntRun) {
    assert.notInclude(standardizedOutput, fileShouldntRun)
  }
}
