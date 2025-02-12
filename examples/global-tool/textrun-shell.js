import path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export default {
  globals: {
    tool: path.join(__dirname, "public", "tool"),
  },
}
