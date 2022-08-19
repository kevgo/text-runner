import * as fs from "fs-extra"

import * as configuration from "../configuration/index.js"

/** creates the temp directory to run the tests in */
export async function create(config: configuration.Data): Promise<void> {
  if (config.emptyWorkspace) {
    await fs.emptyDir(config.workspace.platformified())
  }
}
