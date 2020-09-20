import * as color from "colorette"
import * as events from "events"
import * as tr from "text-runner-core"
import * as config from "../configuration"
import * as configFile from "../config-file"

export class SetupCommand extends events.EventEmitter implements tr.Command {
  config: config.Data

  constructor(config: config.Data) {
    super()
    this.config = config
  }

  async execute() {
    await configFile.create(this.config)
    this.emit(tr.CommandEvent.output, `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }
}
