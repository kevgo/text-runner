import { promises as fs } from "fs"

import * as configuration from "../configuration/index"

/** creates the temp directory to run the tests in */
export async function create(config: configuration.Data): Promise<void> {
  if (config.emptyWorkspace) {
    await fs.mkdir(config.workspace.platformified(), { recursive: true })
  }
}
