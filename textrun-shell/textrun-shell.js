import path from "node:path"
import * as url from "node:url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export default {
  globals: {
    "text-runner": path.join(__dirname, "node_modules", ".bin", "text-runner")
  }
}
