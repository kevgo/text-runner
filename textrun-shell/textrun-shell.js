import path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export default {
  globals: {
    "text-run": path.join(__dirname, "node_modules", ".bin", "text-run")
  }
}
