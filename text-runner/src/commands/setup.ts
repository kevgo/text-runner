import * as color from "colorette"
import { createConfigurationFile } from "../configuration/config-file/create-configuration-file"
import { EventEmitter } from "events"
import { CommandEvent, Command } from "./command"
import { loadConfiguration } from "../configuration/load-configuration"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"

export class SetupCommand extends EventEmitter implements Command {
  userConfig: UserProvidedConfiguration

  constructor(userConfig: UserProvidedConfiguration) {
    super()
    this.userConfig = userConfig
  }

  async execute() {
    const config = await loadConfiguration(this.userConfig)
    await createConfigurationFile(config.sourceDir || ".")
    this.emit(CommandEvent.output, `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }
}
