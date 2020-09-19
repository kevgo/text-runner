import * as color from "colorette"
import * as events from "events"
import * as tr from "text-runner-core"
import * as configFile from "../configuration/config-file"
import { CLIConfiguration } from "../configuration/cli-configuration"

export class SetupCommand extends events.EventEmitter implements tr.Command {
  config: CLIConfiguration

  constructor(config: CLIConfiguration) {
    super()
    this.config = config
  }

  async execute() {
    await configFile.create(this.config)
    this.emit(tr.CommandEvent.output, `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }
}
