import color from "colorette"
import { createConfigurationFile } from "../configuration/create-configuration-file"

export async function setupCommand() {
  await createConfigurationFile()
  console.log(
    color.green(
      `Created configuration file ${color.cyan(
        "text-run.yml"
      )} with default values`
    )
  )
}
