import * as color from "colorette"
import { createConfigurationFile } from "../configuration/config-file/create-configuration-file"
import { ExecuteResult } from "../text-runner"
import { UserProvidedConfiguration } from "../configuration/user-provided-configuration"

export async function setupCommand(config: UserProvidedConfiguration): Promise<ExecuteResult> {
  await createConfigurationFile(config.sourceDir || ".")
  if (config.formatterName !== "silent") {
    console.log(color.green(`Created configuration file ${color.cyan("text-run.yml")} with default values`))
  }
  return ExecuteResult.empty()
}
