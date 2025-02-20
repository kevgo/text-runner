import cliCursor from "cli-cursor"
import { main } from "./main.js"

cliCursor.hide()
let errorCount = await main()
process.exit(errorCount)
