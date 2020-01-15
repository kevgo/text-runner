import path from "path"
import slugify from "@sindresorhus/slugify"

export function getActionName(filepath: string): string {
  return slugify(path.basename(filepath, path.extname(filepath)))
}
