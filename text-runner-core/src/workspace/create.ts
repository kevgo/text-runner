import { promises as fs } from "fs"

import * as configuration from "../configuration/index"

/** creates the temp directory to run the tests in */
export async function create(config: configuration.Data): Promise<void> {
  if (config.emptyWorkspace) {
    const workspacePath = config.workspace.platformified()
    try {
      await fs.rmdir(workspacePath, { recursive: true })
    } catch (e) {
      // no problem if this fails
    }
    await fs.mkdir(workspacePath, { recursive: true })
  }
}
