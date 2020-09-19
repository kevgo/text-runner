import * as color from "colorette"
import * as events from "events"
import * as tr from "text-runner-core"
import { ConfigFileManager } from "../configuration/config-file"
import { CLIConfiguration } from "../configuration/configuration"

export class SetupCommand extends events.EventEmitter implements tr.Command {
  config: CLIConfiguration

  constructor(config: CLIConfiguration) {
    super()
    this.config = config
  }

  async execute() {
    await new ConfigFileManager(this.config).create()
    this.emit(tr.CommandEvent.output, `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }
}
