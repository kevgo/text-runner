import { styleText } from "node:util"
import * as observableProcess from "observable-process"
import * as textRunner from "text-runner-engine"
import * as trExt from "textrun-extension"

import { Configuration } from "../helpers/configuration.js"
import { CurrentServer } from "../helpers/current-server.js"
import { parseCommand } from "../helpers/parse-command.js"

/**
 * The "start" action runs the given commands on the console.
 * It leaves the command running.
 */
export async function server(action: textRunner.actions.Args): Promise<void> {
  const configPath = action.configuration.sourceDir.joinStr("textrun-shell.js")
  const config = await Configuration.load(configPath)
  var commandText = action.region[0].attributes["command"]
  if (commandText === "") {
    throw new Error('empty "command" attribute')
  }
  if (!commandText) {
    commandText = action.region.text()
  }
  const commandsToRun = parseCommand(commandText, config.pathMapper().globalizePathFunc())
  if (commandsToRun === "") {
    throw new Error(
      `the <${
        action.region[0].tag
      } ${action.configuration.regionMarker}="shell/command"> region contains no commands to run`
    )
  }
  action.name(`starting a server process: ${styleText(["bold", "cyan"], commandsToRun)}`)
  CurrentServer.instance().set(
    observableProcess.start(trExt.callArgs(commandsToRun, process.platform), {
      cwd: action.configuration.workspace.platformified()
    })
  )
}
