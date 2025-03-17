import { flatten } from "array-flatten"
import { assert } from "chai"
import * as fs from "fs"
import { globby } from "globby"

import { TRWorld } from "../world.js"
import * as workspace from "./workspace.js"

export async function verifyRanOnlyTestsCLI(filenames: string[] | string[][], world: TRWorld): Promise<void> {
  const flattened = flatten(filenames)
  if (!world.finishedProcess) {
    throw new Error("no process output found")
  }
  const standardizedOutput = world.finishedProcess.combinedText.replace(/\\/g, "/")

  // verify the given tests have run
  for (const filename of flattened) {
    assert.include(standardizedOutput, filename)
  }

  // verify all other tests have not run
  const filesShouldntRun = (await globby(`${workspace.absPath}/**`))
    .filter(file => fs.statSync(file).isFile())
    .map(file => workspace.absPath.relativeStr(file))
    .filter(file => file)
    .map(file => file.replace(/\\/g, "/"))
    .filter(file => flattened.indexOf(file) === -1)
  for (const fileShouldntRun of filesShouldntRun) {
    assert.notInclude(standardizedOutput, fileShouldntRun)
  }
}
