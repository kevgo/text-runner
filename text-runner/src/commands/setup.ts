import * as color from "colorette"
import { createConfigurationFile } from "../configuration/config-file/create-configuration-file"

export async function setupCommand() {
  await createConfigurationFile()
  console.log(color.green(`Created configuration file ${color.cyan("text-run.yml")} with default values`))
}
