import { promises as fs } from "fs"

import * as configuration from "../configuration/index.js"

/** creates the temp directory to run the tests in */
export async function create(config: configuration.Data): Promise<void> {
  const path = config.workspace.platformified()
  if (config.emptyWorkspace) {
    await fs.rm(path, { force: true, recursive: true })
  }
  await fs.mkdir(path, { recursive: true })
}
