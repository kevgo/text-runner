import path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export default {
  globals: {
    "text-runner": path.join(__dirname, "..", "text-runner-cli", "bin", "text-runner")
  }
}
