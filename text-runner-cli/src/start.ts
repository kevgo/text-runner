import cliCursor from "cli-cursor"

import { main } from "./main.js"

async function start() {
  cliCursor.hide()
  const errorCount = await main(process.argv)
  process.exit(errorCount)
}

start()
