import * as slugify from "@sindresorhus/slugify"
import * as path from "path"

export function name(filepath: string): string {
  return slugify(path.basename(filepath, path.extname(filepath)))
}
