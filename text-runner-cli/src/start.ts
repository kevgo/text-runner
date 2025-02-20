import cliCursor from "cli-cursor"
import { main } from "./main.js"

cliCursor.hide()
let errorCount = await main(process.argv)
process.exit(errorCount)
