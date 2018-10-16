import glob from "glob"
import path from "path"
import trimExtension from "./trim-extension"

export default function builtinActionFilenames(): string[] {
  return glob
    .sync(path.join(__dirname, "..", "actions", "*.js"))
    .map(trimExtension)
}
