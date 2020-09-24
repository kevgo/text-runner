import * as path from "path"
import * as slugify from "@sindresorhus/slugify"

export function name(filepath: string): string {
  return slugify(path.basename(filepath, path.extname(filepath)))
}
