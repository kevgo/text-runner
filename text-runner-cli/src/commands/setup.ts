import * as color from "colorette"
import { createConfigurationFile } from "../config-file/create-configuration-file"
import * as events from "events"
import * as tr from "text-runner-core"

export class SetupCommand extends events.EventEmitter implements tr.Command {
  config: tr.Configuration

  constructor(config: tr.Configuration) {
    super()
    this.config = config
  }

  async execute() {
    await createConfigurationFile(this.config.sourceDir || ".")
    this.emit(tr.CommandEvent.output, `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }
}
