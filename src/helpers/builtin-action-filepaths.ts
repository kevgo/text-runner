import glob from "glob"
import path from "path"

export default function builtinActionFilenames(): string[] {
  return glob.sync(path.join(__dirname, "..", "actions", "*.js"))
}
