import * as path from "node:path"
import slugify from "@sindresorhus/slugify"

export function name(filepath: string): string {
  return slugify(path.basename(filepath, path.extname(filepath)))
}
