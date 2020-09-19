import * as color from "colorette"
import * as events from "events"
import * as tr from "text-runner-core"
import { ConfigFileManager } from "../config-file"
import { Configuration } from "../user-provided-configuration"

export class SetupCommand extends events.EventEmitter implements tr.Command {
  config: Configuration

  constructor(config: Configuration) {
    super()
    this.config = config
  }

  async execute() {
    await new ConfigFileManager(this.config)
    this.emit(tr.CommandEvent.output, `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }
}
